const dotenv=require("dotenv")
dotenv.config()
const express = require("express")
const app =express()
const mongoose=require("mongoose")
const PORT=process.env.PORT||3000
const cors=require('cors')
const cookieParser =require("cookie-parser")

app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded())
app.use(cors(
    {
        origin:process.env.FRONT_ORIGIN,
        credentials:true
    }
))

mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("연결 성공")
}).catch((error)=>console.log("연결 실패",error))


const userRoutes =require("./routes/user")
const contactRoutes = require('./routes/contactRoutes')
app.use("/api/auth",userRoutes)
app.use("/api/contact",contactRoutes)


app.listen(PORT,()=>{
    console.log('Server is running')
})

app.get("/",(req,res)=>{
    res.send("Hello Express")
})