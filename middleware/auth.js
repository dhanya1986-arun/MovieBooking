const jwt=require('jsonwebtoken');
const crypto = require('crypto');
const tokenSecret = crypto.randomBytes(64).toString('hex');

module.exports=function (req,res,next){
const token=req.header('x-auth-token');
if(!token)return res.status(401).json({message:"no token"});

try{
    const decoded=jwt.verify(token,tokenSecret);
    req.user=decoded.id;
    next();
    
}catch(error){
    res.status(401).json({message:"invalid token"});
}
}