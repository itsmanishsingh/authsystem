const jwt = require('jsonwebtoken');

// Model is optional 

const auth = (req,res,next)=>{
    const token = req.header("Authorization").replace("Bearer ","") || req.cookies.token || req.body.token;

    if(!token){
       return res.status(403).json(`Token is missing`);
    }

    try {
        const decode = jwt.verify(token , process.env.SECRET_KEY);
        console.log(decode);
        req.user = decode;
        // Bring in info from Database
        
    } catch (error) {
        return res.status(401).send(`Invalid Token`);
    }

    return next();
}


module.exports = auth;