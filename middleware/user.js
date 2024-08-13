
const jwt = require('jsonwebtoken');
const User = async (req,res,next)=>{
    try{
        const token = req.header("x-auth-token");
       
        if(!token){
            return res.json({msg:"Token not found"});
        }

        const isVerified = await jwt.verify(token,"passwordkey");
        console.log(isVerified);
        if(!isVerified){
            return res.json({msg:"Token is invalid. Accessed denied"})
        }
          
   req.user = isVerified;

   req.token = token;

   next();

    }catch(e){
        return res.status(500).json({msg:e.message})
    }
}

module.exports = User;