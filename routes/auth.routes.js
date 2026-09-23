import { Router } from "express";

import jwt from "jsonwebtoken"
import  {authvali} from "../auth_schema.js"
import {createDB} from "../db.js"
import bcrypt from "bcrypt"
import {validate} from "../bodyValidation.js"
import z from "zod"
import { loginsch } from "../login.schema.js"
const db=createDB()
export const authRouter = Router();


process.loadEnvFile()

/**
 * @swagger /auth/login
 * POST /auth/login
 *
 * @description Authenticate a user with email and password.
 *
 * @body {string} email - User's email address
 * @body {string} password - User's password
 *
 * @success {200} { message: string }
 *   Returns a success message on successful login.
 *
 * @error {422} { errors: { [field]: { errors: string[] } } }
 *   Validation failed (missing or invalid fields).
 *   Example: { errors: { email: { errors: ["Required"] }, password: { errors: ["Required"] } } }
 *
 * @error {500} { error: string }
 *   Internal server error.
 *   Example: { error: "something went wrong" }
 */
authRouter.post("/login",validate(loginsch),async (req, res) => {

  // TODO: implement actual authentication (bcrypt, JWT, etc.)
  //chech email 
    const data =await db.getall("auth_users")
    const check = data.find((x)=>x.email===req.body.email)
    if(!check){
        return res.status(422).json({
            "error":"email or password is invailed"
        })
    }
    //compare password
    const comp=await bcrypt.compare(req.body.password,check.password)

    if(!comp){
        return res.status(422).json({ "error": "email or password are invalid" })
    }
    //create token   
    const token =jwt.sign(check,process.env.JWT_SECRET)
    //cookies 
    res.cookie("node_api_token",token,{
        httpOnly:true,
        sameSite:"lax"
        ,maxAge:60*60*1000
    })
  res.json({ message: "login endpoint" });
});

/**
 * @swagger /auth/register
 * POST /auth/register
 *
 * @description Register a new user account.
 *
 * @body {string} username - Desired username
 * @body {string} email - User's email address
 * @body {string} password - User's password
 * @body {string} password_confirmation - Password confirmation (must match password)
 *
 * @success {201} { message: string }
 *   Returns a success message on successful registration.
 *
 * @error {422} { errors: { [field]: { errors: string[] } } }
 *   Validation failed (missing fields or passwords don't match).
 *   Example: { errors: { email: { errors: ["Required"] }, password_confirmation: { errors: ["Passwords do not match"] } } }
 *
 * @error {500} { error: string }
 *   Internal server error.
 *   Example: { error: "something went wrong" }
 */
authRouter.post("/register",validate(authvali), async(req, res) => {

  // TODO: implement actual registration (hash password, save user, etc.)
   //validTE data 
        //hash password 
      const hash =await bcrypt.hash(req.body.password,10)
    
   //chech email is uniqe
    const data =await db.getall("auth_users")
    const check =data.find((x)=>x.email===req.body.email)
    if(check){
      return res.status(422).json({
        errors: "email already in use"
      })}

    await db.create("auth_users",{
        email:req.body.email
,   password:hash
,username:req.body.username
,isVerified:false
    })
  res.status(201).json({ "message": "register endpoint" });
});

/**
 * @swagger /auth/logout
 * POST /auth/logout
 *
 * @description Log out the current user (invalidate session/token).
 *
 * @success {200} { message: string }
 *   Returns a success message on successful logout.
 *
 * @error {500} { error: string }
 *   Internal server error.
 *   Example: { error: "something went wrong" }
 */
authRouter.post("/logout", (req, res) => {
  // TODO: implement actual logout (destroy session, invalidate token, etc.)
  res.clearCookie("node_api_token")
  res.json({ message: "logout endpoint" });
});
/**use this template to implement auth

you need to implement login, register, logout

use JWT for tokens

implement a auth middleware to check user auth at home page endpoints

test the auth by running the app and navigate to http://localhost:3000/login.html
 */