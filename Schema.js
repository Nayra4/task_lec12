import z from "zod"
export const schema=z.object({
    name:z.string().min(2)
    ,books:z.array(z.string()).min(1)
})
export const paraschema=z.coerce.number().int().positive()

export const searchschema=z.object({
    search:z.string().trim().min(3,"should the sring be >3 letter")
})
