import z from "zod"
export const authvali=z.object({
    email:z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/),
    password:z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"at least 1 small letter ,at least 1 big letter, at least 1 spicial character  ,at lest 1 digit  ")
    ,password_confirm:z.string().min(8).regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,"at least 1 small letter ,at least 1 big letter, at least 1 spicial character  ,at lest 1 digit  ")
    ,usename:z.string().min(2)

}).refine((x)=>{ return x.password===x.password_confirm},{error:"password and password_confirm don`t match "})