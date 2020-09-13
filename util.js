const session = require('express-session');

const isAuth = (req,res,next) => {
    if(req.session.user){
        next();
    }
    else{
        return res.status(401).redirect("/");
    }
};

module.exports = isAuth;
