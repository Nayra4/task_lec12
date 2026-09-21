import  jwt  from "jsonwebtoken"

export function checkauth(req,res,next){
    ///get cookies
    const token =req.cookies.node_api_token
    
    
    //verify cookies
    try{
    const verify=jwt.verify(token,process.env.JWT_SECRET)
        next()
}catch{
    return res.status(401).json({
        error:"invalid token"
    })
}


}