const session = require('express-session');

const isAuth = (req,res,next) => {
    if(req.session.user){
        return res.status(401).send({msg: "User is not supplied"});
    }
    else{
        next();
    }
};

module.exports = isAuth;