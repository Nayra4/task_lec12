import express from "express"
import {auth_route} from "./auth.routes.js"
import { user_router } from "./user.routes.js"
import { auther_routes } from "./author.routes.js"
import cookieParser from "cookie-parser"

const app=express()
app.use(express.json())
app.use(cookieParser())
app.use("/users",user_router)
app.use("/author",auther_routes)
app.use("/auth",auth_route)

app.use((req,res,next)=>{
    console.log(new Date().toLocaleString(),req.method);
    next()
})
//global error handler
app.use((err,req,res,next)=>{
    console.log("error",err);
    res.status(500).json("something went wrong")
    
})
app.listen(3000,()=>{ console.log("listening in port 3000");})
