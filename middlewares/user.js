const jwt=require('jsonwebtoken')
const { JWT_SECRET } = require('../config')

function userMiddleWare(req,res,next){
    const token=req.headers.token
    
    const isValid=jwt.verify(token,JWT_SECRET)
    if(isValid){
        req.userId=isValid.userId
        next()
    }
    else{
        res.json({
            Message:"Wrong Token"
        })
    }
}

module.exports=({
    userMiddleWare
})