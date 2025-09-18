const dotenv = require("dotenv");
const express = require("express");
const mongoose =require("mongoose")
const app = express();
const cors=require("cors")
const cookieParser = require("cookie-parser");
dotenv.config();
const PORT = process.env.PORT || 3000; 

app.set("trust proxy", 1);  
app.use(cors({
  origin: process.env.FRONT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // 수정: 옵션 명시

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("연결성공")
}).catch((error)=> console.log("실패",error))

const userRoutes =require("./routes/userRoutes")
const contactRoutes=require("./routes/contactRoutes")
app.use("/api/auth",userRoutes)
app.use("/api/contact",contactRoutes)

app.listen(PORT, () => {
    console.log("Server is running");
})

app.get("/", (req,res) => {
    res.send("Hello, world");
})