
import express from "express"
import {createDB} from "./db.js"
import z from "zod"
const db=createDB()
export const user_router=express()
user_router.use(express.json())



user_router.get("/",async (req,res)=>{
    return res.status(200).json(await db.getall("users"))
})
user_router.get("/:id",async(req,res)=>{
    const id=req.params.id
    return res.status(200).json(await db.getby_id("users",id))
})
user_router.post("/",async (req,res)=>{
    const body_data=req.body
    const schema=z.object({
        name:z.string().min(2),
        age:z.number().min(18),
        email:z.email()
    })
    const result=schema.safeParse(body_data)
    console.log(result);
    if(result.success){
        await db.create("users",result.data)
        
        return res.status(201).json({massage:"user created successfuly"})

    }
    else{

        return res.status(422).json({
            massage:z.treeifyError(result.error)
        })
    }
    

    // if(!z.string().min(2).safeParse( body_data.name).success){
    //     return res.status(422).json({
    //         error:"name should be string "
    //     })
    // }
    // // if(!body_data.name.trim()){
    // //     return res.status(422).json({
    // //         error:"name is require"
    // //     })
    // // }
    // if(body_data.name.length < 2){
    //     return res.status(422).json({
    //         error:"name should be at least 2 letter "
    //     })
    // }
    // if(!body_data.age){
    //     return res.status(422).json({
    //         error:"age  is require"
    //     })
    // }
    // if(body_data.age< 18){
    //     return res.status(422).json({
    //         error:"age  must be 18 "
    //     })
    // }
    // if(typeof body_data.age !== "number"){
    //     return res.status(422).json({
    //         error:"age  should be a number "
    //     })
    // }
    // if(!body_data.email){
    //     return res.status(422).json({
    //         error:"email  is require"
    //     })
    // }
    // const reg=/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    // if(!reg.test(body_data.email)){
    //     return res.status(422).json({
    //         error:"email  is not validate"
    //     })
    // }
    // if(typeof body_data.email !=="string"){
    //     return res.status(422).json({
    //         error:"email  should be string "
    //     })
    // }
    
})
user_router.delete("/:id",async(req,res)=>{
    const id=req.params.id
    await db.delete("users",id)
    return res.status(204).json("users deleted successfuly")
    
})
user_router.put("/:id",async(req,res)=>{
    const id= req.params.id
    const obj=req.body
    await db.update("users",id ,obj)
    return res.status(200).json("updated successfully ")
})


