const express = require("express")
const router = express.Router()

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const User = require("../models/User")
const { default: axios } = require("axios")

const COOKIE_NAME = 'token'
const isProd = process.env.NODE_ENV === 'production'

const SAME_SITE = isProd ? 'none' : 'lax'
const SECURE = isProd ? true : false
const COOKIE_PATH = '/'
router.post('/signup', async (req, res) => {
  try {
    const { username, password } = req.body

    const existingUser = await User.findOne({ username })
    if (existingUser) {
      return res.status(400).json({
        message: "이미 존재하는 사용자입니다."
      })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = new User({
      username,
      password: hashedPassword
    })

    await user.save()

    res.status(201).json({ message: "회원가입이 완료 되었습니다." })
  } catch (error) {

    res.status(500).json({ message: "서버 오류 발생" })
    console.log(error)
  }
})

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username }).select("+password")

    if (!user) return res.status(401).json({ message: "사용자 없음" })
    if (!user.isActive) return res.status(401).json({ message: "비활성계정" })//false일때 비활성

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      user.failedLoginAttempts += 1
      user.lastLoginAttempt = new Date()
      if (user.failedLoginAttempts >= 5) {
        user.isActive = false //5번 이상 넘어가면 비활성 계정으로 변경

        await user.save()
        return res.status(401).json({ message: "비밀번호 5회이상 오류, 계정이 잠겼습니다." })
      }
      await user.save()
      return res.status(401).json({
        message: "비밀번호가 틀렸습니다.",
        failedAttemp: user.failedLoginAttempts + "번 틀림"
      })


    }

    user.failedLoginAttempts = 0
    user.lastLoginAttempt = new Date()
    user.isLoggedIn = true

    try {
      const { data } = await axios.get("https://api.ipify.org/?format=json")
      if (data?.ip) user.ipAdress = data.ip
    } catch (error) {
      console.error("IP주소 조회 실패")
    }
    await user.save()

    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        role: "admin"
      },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    )
    res.cookie(COOKIE_NAME, token, {
      httpOnly: true,
      secure: SECURE,
      sameSite: SAME_SITE,
      maxAge: 24 * 60 * 60 * 1000,
      path: COOKIE_PATH
    })

    const userWithoutPassword = user.toObject()
    delete userWithoutPassword.password

    return res.status(200).json({
      message: "로그인 성공", token,
      user: userWithoutPassword
    })


  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "서버오류" })
  }
})

router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies.token

    if (!token) {
      return res.status(400).json({ message: '이미 로그아웃된 상태입니다.' })
    }

    try {

      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      const user = await User.findById(decoded.userId)

      if (user) {
        user.isLoggedIn = false
        await user.save()
      }

    } catch (error) {
      console.log("토큰 검증 오류", error)
    }

    res.clearCookie(COOKIE_NAME, {
      httpOnly: true,
      secure: SECURE,
      sameSite: SAME_SITE,
      path: COOKIE_PATH
    })

    res.json({ message: '로그아웃 되었습니다.' })



  } catch (error) {

    console.log("로그아웃중 서버오류", error)
    res.status(500).json({ message: "서버 오류가 발생" })
  }
})

router.get('/users', async (req, res) => {
  try {

    const users = await User.find().sort({ createdAt: -1 })

    return res.status(201).json({ message: "전체 유저 가져오기 성공", users })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "서버오류" })
  }
})
router.delete('/delete/:userId', async (req, res) => {
  try {

    const user = await User.findByIdAndDelete(req.params.userId)

    if (!user) {

      return res.status(404).json({ message: "사용자를 찾을 수 없습니다." })
    }

    return res.status(201).json({ message: "사용자 삭제 성공" })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "서버오류" })
  }
})

router.post('/verify-token', (req, res) => {
  const token = req.cookies.token

  if (!token) {
    return res.status(400).json({
      isValid: false,
      message: "토큰이 없습니다."
    })
  }
  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    return res.status(200).json({
      isValid: true,
      user: decoded
    })

  } catch (error) {
    return res.status(401).json({
      isValid: false,
      message: "유효하지 않은 토큰입니다."
    })
  }
})

module.exports = router