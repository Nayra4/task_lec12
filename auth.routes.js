import express from "express"
import jwt from "jsonwebtoken"
import  {authvali} from "./auth_schema.js"
import {createDB} from "./db.js"
import bcrypt from "bcrypt"
import {validate} from "./bodyValidation.js"
import z from "zod"
import { loginsch } from "./login.schema.js"
const db=createDB()
export const auth_route=express()
auth_route.use(express.json())

process.loadEnvFile()



auth_route.post("/register",validate(authvali),async(req,res)=>{
    //validTE data 

    //hash password 
    const hash =await bcrypt.hash(req.body.password,10)
    //chech email is uniqe
    const data =await db.getall("auth")
    const check =data.find((x)=>x.email===req.body.email)
    if(check){
        return res.status(422).json({
            massage:" email is already in use "
        })
    }
    await db.create("auth",{
        email:req.body.email
,   password:hash
,usename:req.body.usename
,isVerified:false
    })
    return res.status(201).json({massage:"created successfilly "})

    
})
auth_route.post("/login",validate(loginsch),async(req,res)=>{
    //chech email 
    const data =await db.getall("auth")
    const check = data.find((x)=>x.email===req.body.email)
    if(!check){
        return res.status(422).json({
            error:"email or password is invailed"
        })
    }
    //compare password
    const comp=await bcrypt.compare(req.body.password,check.password)

    if(!comp){
        return res.status(422).json({
            error:"email or password is invailed"})
    }
    //create token   
    const token =jwt.sign(check,process.env.JWT_SECRET)
    //cookies 
    res.cookie("node_api_token",token,{
        httpOnly:true,
        sameSite:"lax"//ممكن تكون على اي حاجه فى نفس domain
        ,maxAge:60*60*1000
    })
    //response
    return res.status(200).json({
        massage:"user login successfully"
        ,data:check
    })
})
auth_route.post("/logout",(req,res)=>{
    res.clearCookie("node_api_token")
    
    return res.status(200).json({
        massage: "user logout successsfully "
    })
})
