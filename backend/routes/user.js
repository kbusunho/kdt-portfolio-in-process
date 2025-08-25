const express = require("express")
const router = express.Router()

const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const axios = require("axios")

const User = require("../models/User")

// 회원가입
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
    console.error(error)
    res.status(500).json({ message: "서버 오류 발생" })
  }
})

// 로그인
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body

    const user = await User.findOne({ username }).select("+password")

    if (!user) return res.status(401).json({ message: "사용자 없음" })
    if (!user.isActive) return res.status(401).json({ message: "비활성계정" }) // return 추가

    const isMatch = await bcrypt.compare(password, user.password)

    if (!isMatch) {
      user.failedLoginAttempts += 1
      user.lastLoginAttempt = new Date()

      if (user.failedLoginAttempts >= 5) {
        user.isActive = false // 5번 이상 실패 → 계정 잠금
        await user.save()
        return res.status(401).json({ message: "비밀번호 5회 이상 오류, 계정이 잠겼습니다." })
      }

      await user.save()
      return res.status(401).json({
        message: "비밀번호가 틀렸습니다.",
        failedAttempt: user.failedLoginAttempts + "번 틀림"
      })
    }

    // 로그인 성공 시 초기화
    user.failedLoginAttempts = 0
    user.lastLoginAttempt = new Date()
    user.isLoggedIn = true

    try {
      const { data } = await axios.get("https://api.ipify.org/?format=json")
      if (data?.ip) user.ipAddress = data.ip
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

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000
    })

    const userWithoutPassword = user.toObject()
    delete userWithoutPassword.password

    return res.status(200).json({
      message: "로그인 성공",
      token,
      user: userWithoutPassword
    })

  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: "서버 오류" })
  }
})

module.exports = router
