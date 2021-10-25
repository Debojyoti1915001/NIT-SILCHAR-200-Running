const jwt = require('jsonwebtoken')
const Hospital = require('../models/Hospital')


require('dotenv').config()

const requireAuth = (req, res, next) => {
    try{
    const token = req.cookies.hospital
    //console.log(token);
    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
            if (err) {
                console.log(err.message)

                res.redirect('/hospital/login')
            } else {
                let hospital = await Hospital.findById(decodedToken.id)
                
                if (hospital == null)
                {
                    req.flash("error_msg", "You do not have an account yet, kindly sign up for one"); 
                    res.clearCookie('hospital');
                    res.redirect("/hospital/signup"); 
                    return; 
                }

                req.hospital = hospital
                //console.log("current user", req.user)

                next()
            }
        })
    } else {
        res.redirect('/hospital/login')
    }
}
catch(error){
    res.redirect("/hospital/login");
}
}


const redirectIfLoggedIn = (req, res, next) => {
    const token = req.cookies.hospital 
    if (token)
    {
        req.flash("error_msg", "You are already logged in.")
        res.redirect("/hospital/profile")
    }
    else
    {
        next(); 
    }
}

module.exports = { requireAuth, redirectIfLoggedIn }
