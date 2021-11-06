const express = require('express')
const jwt = require('jsonwebtoken')
const router = express.Router()
const Contact = require('../models/Contact');
const User = require('../models/User');
const { contactMail } = require('../config/nodemailer');
//Route for homepage
router.get('/', (req, res) => {
    var c=false
    const cookie=req.cookies.jwt
    
    var user={profilePic:null,name:null};
    // console.log(user)
    const token = req.cookies.jwt
    // console.log(token);
    // check json web token exists & is verified
    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
           
                user = await User.findById(decodedToken.id)
                if(cookie!==undefined)c=true
    res.render('./userViews/product',{
        c,
        user
    })
        })
        
    }else{
        if(cookie!==undefined)c=true
    res.render('./userViews/product',{
        c,
        user
    })
    } 
    
    // console.log(req.cookies.jwt)
    
});

router.post('/contact',async(req,res)=>{
    try{
        const { name, email, subject, message } = req.body;
        if(!email.trim()){
            req.flash('error_msg','Please provide a valid email');
            res.redirect('/');
        }
        const newIssue = await new Contact({
            name,
            email,
            subject,
            message
        }).save();
        if(!newIssue){
            req.flash('error_msg','Issue cannot be created');
            return res.redirect('/');
        }
        // console.log(newIssue);
        contactMail(newIssue,'user');
        contactMail(newIssue,'admin');
        req.flash('success_msg','Your issue has been reported');
        res.redirect('/');
    }
    catch(err){
        console.error(err);
        req.flash('error_msg','Something went wrong. Try again.');
        return res.redirect('/');
    }
})

module.exports = router
