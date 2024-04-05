const jwt = require('jsonwebtoken');

 
const verifyToken = async(req, res, next)=>{
    try{
        const BearerToken = req.headers.authorization;
        const token       = BearerToken.split(' ')[1];
        if(token === ""){
            res.status(202).send('No token provided');}
        else{
            //checking of the token
            const isTokenValid = jwt.verify(token, process.env.TOKEN_PASS);
            if(isTokenValid){
                req.user = isTokenValid;
                next();
            }
            else{
                res.status(203).send('Invalid Token');
            }
        }
    }
    catch(e){
        res.status(500).send(e.message);
    }
}

module.exports = verifyToken;
