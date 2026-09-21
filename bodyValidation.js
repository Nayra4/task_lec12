import z from "zod"
export const validate =(schema)=>{
return (req,res,next)=>{
    const data= req.body
    const result =schema.safeParse(data)
    if(!result.success){
        return res.status(400).json({
            massage:z.treeifyError(result.error)
        })
    }
    next()
}
}
