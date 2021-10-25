const express = require('express')
const router = express.Router()
const Contact = require('../models/Contact');
const { contactMail } = require('../config/nodemailer');
//Route for homepage
router.get('/', (req, res) => {
    res.render('./userViews/index')
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
