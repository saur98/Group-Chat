const jwt = require('jsonwebtoken');

module.exports = (req,res,next) => {
    const token = req.header('x-auth-token');
    
    if(!token){
        
        return res.status(401).json({msg : 'no token'});
    }
    
    try{

        const decrypted = jwt.verify(token, process.env.jwtSecret)

        req.user = decrypted.user;
        next();
    } catch(err){
        return res.status(401).json({msg : 'invalid token'});
    }
}