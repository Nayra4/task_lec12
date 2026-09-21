import z from "zod"
export const loginsch=z.object({
    email:z.string()
    ,
    password:z.string()
})