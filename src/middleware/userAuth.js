const jwt = require('jsonwebtoken')
const User = require('../models/User')

require('dotenv').config()

const requireAuth = (req, res, next) => {
    try{
    const token = req.cookies.jwt
    //console.log(token);
    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err.message)

                res.redirect('/user/login')
            } else {
                let user = await User.findById(decodedToken.id)
                // if null then redirect to signup
                if (user == null)
                {
                    req.flash("error_msg", "You do not have an account yet, kindly sign up for one"); 
                    res.clearCookie('jwt')
                    res.redirect("/user/signup"); 
                    return; 
                }
                //else to profile
                req.user = user
                //console.log("current user", req.user)

                next()
            }
        })
    } else {
        res.redirect('/user/login')
    }
}
catch(error){
    res.redirect("/user/login");
}
}


const redirectIfLoggedIn = (req, res, next) => {
    const token = req.cookies.jwt 
    if (token)
    {
        req.flash("error_msg", "You are already logged in.")
        res.redirect("/user/profile")
    }
    else
    {
        next(); 
    }
}

module.exports = { requireAuth, redirectIfLoggedIn }
