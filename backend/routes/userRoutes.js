// Express 모듈 불러오기
const express = require("express");

// Express의 Router 기능 사용 (라우터 분리용)
const router = express.Router();

// 비밀번호 해시화를 위한 bcrypt 불러오기
const bcrypt = require("bcrypt");
const axios = require("axios");
const jwt = require("jsonwebtoken")
// Mongoose 사용자 모델 불러오기
const User = require("../models/User");

const COOKIE_NAME = 'token';
const isProd = process.env.NODE_ENV === 'production';

// 프론트/백이 "완전 같은 사이트"가 아니면(서버와 프론트 도메인이 다르면) SameSite=None + Secure 필수
// 로컬(동일 site: localhost:5173 ↔ localhost:3000)은 'lax'로도 충분
const SAME_SITE = isProd ? 'none' : 'lax';   // 배포: none, 로컬: lax
const SECURE = isProd ? true : false;    // 배포: true(HTTPS), 로컬: false
const COOKIE_PATH = '/';

// POST /signup : 회원가입 처리 라우트
router.post("/signup", async (req, res) => {
  try {
    // 클라이언트에서 전달된 username과 password 추출
    const { username, password } = req.body;

    // 동일한 username이 이미 존재하는지 확인
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      // 이미 존재하면 400 에러 반환
      return res.status(400).json({ message: "이미 존재하는 사용자입니다." });
    }

    // 비밀번호를 bcrypt로 해시 처리 (보안 강화)
    const hashedPassword = await bcrypt.hash(password, 10); // 10: salt rounds

    // 새로운 사용자 인스턴스 생성
    const user = new User({
      username,                  // 사용자 이름
      password: hashedPassword, // 해시된 비밀번호 저장
    });

    // DB에 사용자 저장
    await user.save();

    // 성공 응답 반환
    res.status(201).json({ message: "회원가입이 완료되었습니다." });
  } catch (error) {
    // 서버 오류 발생 시 500 에러 응답
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
    console.log(error); // 콘솔에 에러 로그 출력
  }
});
router.get("/users", async (req, res) => {
  try {

    const users = await User.find().select('-password').sort({ createdAt: -1 });
    // 성공 응답 반환
    res.status(200).json({ message: "전체 유져 가져오기", users });
  } catch (error) {
    // 서버 오류 발생 시 500 에러 응답
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
    console.log(error); // 콘솔에 에러 로그 출력
  }
});

// 로그인: 잠금 로직은 유지, 숫자 응답은 제거
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username }).select("+password");
    if (!user) return res.status(401).json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
    if (user.isActive === false) return res.status(423).json({ message: "계정이 잠겨 있습니다. 관리자에게 문의하세요." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      user.failedLoginAttempts = (user.failedLoginAttempts || 0) + 1;
      user.lastLoginAttempt = new Date();

      const MAX = 5;
      if (user.failedLoginAttempts >= MAX) {
        user.isActive = false;
        await user.save();
        // 잠김: 423 Locked 활용(선택), 아니면 401로 통일해도 됨
        return res.status(423).json({ message: "비밀번호 5회 이상 오류로 계정이 잠겼습니다." });
      }

      await user.save();
      // 일반 실패: 숫자 미노출
      return res.status(401).json({ message: "아이디 또는 비밀번호가 올바르지 않습니다." });
    }

    // 성공 시 카운터 초기화
    user.failedLoginAttempts = 0;
    user.lastLoginAttempt = new Date();
    user.isLoggedIn = true;

    // (선택) IP 기록
    try {
      const { data } = await axios.get("https://api.ipify.org?format=json");
      if (data?.ip) user.ipAddress = data.ip;
    } catch {}

    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "3h" }
    );

    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: SAME_SITE,
      secure: SECURE,
      maxAge: 24 * 60 * 60 * 1000,
      path: COOKIE_PATH,
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    return res.status(200).json({ message: "로그인 성공", user: userWithoutPassword });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "서버 오류" });
  }
});

router.post("/logout", async (req, res) => {
  try {
    // 1. 쿠키에서 토큰 추출
    const token = req.cookies.token;

    // 2. 토큰이 없으면 이미 로그아웃된 상태로 간주
    if (!token) {
      return res.status(400).json({ message: "이미 로그아웃된 상태입니다." });
    }

    try {
      // 3. 토큰 디코딩 (유효성 검증 포함)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. 토큰 안에 포함된 userId로 사용자 조회
      const user = await User.findById(decoded.userId);

      // 5. 사용자가 존재하면 로그인 상태 해제 후 저장
      if (user) {
        user.isLoggedIn = false;
        await user.save();
      }
    } catch (error) {
      // (주의) 토큰이 만료되었거나 변조된 경우
      console.log("토큰 검증 오류:", error.message);
    }

    // 6. 응답 전에 쿠키에서 토큰 제거
    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      sameSite: SAME_SITE,
      secure: SECURE,
      path: COOKIE_PATH,
      // domain: '.your-domain.com'
    });
    return res.json({ message: '로그아웃되었습니다.' });

  } catch (error) {
    // 서버 내부 오류 처리
    console.log("로그아웃 중 서버 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});
router.delete("/delete/:userId", async (req, res) => {
  try {
    // 1. 요청 URL의 파라미터에서 userId 추출하여 사용자 삭제 시도
    const user = await User.findByIdAndDelete(req.params.userId);

    // 2. 사용자가 존재하지 않으면 404 Not Found 응답
    if (!user) {
      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." });
    }

    // 3. 삭제가 성공적으로 완료된 경우 성공 메시지 반환
    res.json({ message: "사용자가 성공적으로 삭제되었습니다." });

  } catch (error) {
    // 4. 서버 에러 발생 시 500 응답 + 에러 객체 포함
    res.status(500).json({ message: "서버 오류 발생", error });
  }
});

// 토큰 유효성 검사를 위한 라우터
router.post("/verify-token", (req, res) => {
  // 요청 쿠키에서 토큰 추출
  const token = req.cookies.token;

  // 토큰이 존재하지 않을 경우 오류 응답
  if (!token) {
    return res.status(400).json({
      isValid: false,
      message: "토큰이 없습니다.",
    });
  }

  try {
    // 토큰 검증 (서버의 JWT_SECRET으로 서명 확인)
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 검증 성공: 사용자 정보 포함 응답
    return res.status(200).json({
      isValid: true,
      user: decoded, // 디코딩된 payload 정보 (예: userId 등)
    });
  } catch (error) {
    // 검증 실패: 유효하지 않은 토큰
    return res.status(401).json({
      isValid: false,
      message: "유효하지 않은 토큰입니다.",
    });
  }
});


// 이 라우터를 외부에서 사용할 수 있도록 내보내기
module.exports = router;

