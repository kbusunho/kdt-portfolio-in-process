// index.js 또는 메인 서버 파일

const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const cookieParser = require("cookie-parser"); // 1. cookieParser 추가
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000; // 2. PORT 변수 정의 추가
const FRONT_ORIGIN = process.env.FRONT_ORIGIN;

// 미들웨어 설정
app.use(cors({
  origin: FRONT_ORIGIN,
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// DB 연결
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB 연결 성공");
  })
  .catch((error) => console.log("MongoDB 연결 실패", error));

// 라우트 설정
const userRoutes = require("./routes/userRoutes");
const contactRoutes = require("./routes/contactRoutes");
app.use("/api/auth", userRoutes);
app.use("/api/contact", contactRoutes);

// 기본 라우트
app.get("/", (req, res) => {
  res.send("Hello, world");
});

// 서버 실행
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});