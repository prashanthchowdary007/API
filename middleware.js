const jwt = require('jsonwebtoken');

module.exports= function(req, res, next){
    try{
        let token = req.header('Postman-Token');
        if(!token){
            return res.send("no token genrated");
        }
        let decode = jwt.verify(token,'jwt');
        req.user = decode.user
        next();
    }
    catch(err){
        console.log(err)
    }
}