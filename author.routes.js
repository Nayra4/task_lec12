
import express from "express"
import {validate} from "./bodyValidation.js"
import {createDB} from "./db.js"
import z from "zod"
import { schema,paraschema, searchschema } from "./Schema.js"
import { checkauth } from "./checkAuth.js"
const db=createDB()
export const auther_routes=express()
auther_routes.use(express.json())







auther_routes.get("/",checkauth,async (req,res)=>{
    return res.status(200).json(await db.getall("author"))
})
auther_routes.get("/",async(req,res)=>{
    const name=req.query.search
    const result=searchschema.safeParse(req.query)
    console.log("name ",name);
    if(result.success){
    const m=await db.getbyname("author",name)
    console.log("name ",m);
    return res.status(200).json(m)}
    else{
        return res.status(500).json({
            massage:z.treeifyError(result.error)       })}
    
})
auther_routes.get("/:id",async(req,res)=>{//validate path params using a zod schema

    const id=req.params.id
    const result=paraschema.safeParse(id)
    if(result.success){
    return res.status(200).json(await db.getby_id("author",id))
}
else{
    return res.status(500).json({
        massage:z.treeifyError(result.error)
    })
}
})
auther_routes.post("/",validate(schema),async (req,res)=>{
    const body_data=req.body
        await db.create("author",body_data)
            return res.status(201).json({
        massage:"author created successfully"
    })

})

auther_routes.delete("/:id",async(req,res)=>{
    const id=req.params.id
    await db.delete("author",id)
    return res.status(204).json("author deleted successfuly")
    
})
auther_routes.put("/:id",validate(schema.partial()),async(req,res)=>{
    const id= req.params.id
    const obj=req.body

        await db.update("author",id ,obj)
        return res.status(200).json("updated successfully ")}
)



