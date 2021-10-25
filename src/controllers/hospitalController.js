const Hospital = require('../models/Hospital'); 
const User=require('../models/User')
const Disease=require('../models/Disease')

const Relations=require('../models/Relations')


const jwt = require('jsonwebtoken')
const { hospitalSignupMail,relationMail, nomineeMail } = require('../config/nodemailer')
const path = require('path')

const { handleErrors } = require('../utilities/Utilities'); 
require('dotenv').config()

const maxAge = 30 * 24 * 60 * 60
module.exports.document_get=async(req,res)=>{
    try{
    const diseaseId=req.query
    const params=new URLSearchParams(diseaseId)
    const newid=params.get('id')
    const userId=params.get('userId')
    const user= await User.findOne({'_id':userId})
    const disease= await Disease.findOne({'_id':newid})
    res.locals.hospital = req.hospital
    // console.log("hospital", res.locals.hospital)
    const patients = await Relations.find({ 'hospitalId': req.hospital._id}, "userId").populate('userId','name'); 
    //console.log('diseases of user',user)
    // console.log('dieasessssssssssssssss',disease)
    if(!disease)
    {
        req.flash('error_msg','User not found')
        res.redirect('/hospital/profile')
    }
    //const diseases=await Disease.populate().execPopulate()
    // console.log('dieases',disease)
    res.render("./hospitalViews/profile",{
        path:'/hospital/document',
        disease,
        user,
        patients, foundUser:null,access:null, 
        custom_flash:null, 
        
    })
   }

    
    catch(e)
    {
        // console.log(e)
        res.redirect('/hospital/profile')
    }
}

module.exports.editDetails_post=async(req,res)=>{
    try{
    //console.log("details",req.hospital)
     const hospital=req.hospital
     hospital.adminName =req.body.adminName
     hospital.adminEmail=req.body.adminEmail
     hospital.adminAddress=req.body.adminAddress
    await hospital.save()
    // console.log("user saved",hospital)
    req.flash('success_msg','Details about the user has been saved')
      

    res.redirect('/hospital/profile')
    }
    catch(e){
        // console.log("error",e)
        req.flash('error_msg','error while editing profile details')
        res.redirect('/hospital/profile')
    }
}


module.exports.patientDiseases_get=async(req,res)=>{
    try{
    const userId=req.query
    const params=new URLSearchParams(userId)
    const short_id=params.get('id')
    const user= await User.findOne({'short_id':short_id})
    res.locals.hospital = req.hospital
    // console.log("hospital", res.locals.hospital)
    const patients = await Relations.find({ 'hospitalId': req.hospital._id}, "userId").populate('userId','name'); 
    //console.log('diseases of user',user)
    if(!user)
    {
        req.flash('error_msg','User not found')
        res.redirect('/hospital/profile')
    }
    const diseases=await user.populate('disease','name').execPopulate()
    //console.log('dieases',diseases)
    res.render("./hospitalViews/profile",{
        path:'/hospital/diseases',
        user:user,
        diseases,
        patients, foundUser:null,access:null, 
        custom_flash:null, 
        
    })
   }

    
    catch(e)
    {
        // console.log(e)
        res.redirect('/hospital/profile')
    }
}


module.exports.patient_get= async (req,res)=>{
    const userId=req.query
    const params=new URLSearchParams(userId)
    const newId=params.get('id')
    //const newId=JSON.parse(userId,true)
    const user=await User.findOne({'_id':newId});
    // console.log('user details',)
    res.locals.hospital = req.hospital
    // console.log("hospital", res.locals.hospital)
    const patients = await Relations.find({ 'hospitalId': req.hospital._id}, "userId").populate('userId','name'); 
    // console.log('relation',patients)
    if(!user)
    {
        req.flash('error_msg','user not found')
        res.redirect('/hospital/profile')
    }
    const diseases=await user.populate('disease','name').execPopulate()
    res.render("./hospitalViews/profile",{
        path:'/hospital/patient',
        user:user,
        patients, foundUser:null,access:null, 
        custom_flash:null, 
        diseases       
    })
}


module.exports.signup_get = (req, res) => {
    res.render("./hospitalViews/signup", { type:"signup" }); 

}

module.exports.profile_get = async (req, res) => {
    res.locals.hospital = req.hospital
     //console.log("hospital", req.hospital)
    const patients = await Relations.find({'isPermitted': true, 'hospitalId': req.hospital._id},"userId").populate('userId','name'); 
    
    // console.log("patientssssss",patients)
    res.render("./hospitalViews/profile",
    {path:'/hospital/profile',
    patients:patients, 
    foundUser:null,
    access:null, 
    custom_flash:null, 
      })
}


module.exports.emailVerify_get = async (req, res) => {
    try {
        const userID = req.params.id
        const expiredTokenUser = await Hospital.findOne({ _id: userID })
        const token = req.query.tkn
        //console.log(token)
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                req.flash(
                    'error_msg',
                    ' Your verify link had expired. We have sent you another verification link'
                )
                hospitalSignupMail(expiredTokenUser, req.hostname, req.protocol)
                return res.redirect('/hospital/login')
            }
            const user = await Hospital.findOne({ _id: decoded.id })
            if (!user) {
                //console.log('user not found')
                res.redirect('/hospital/login')
            } else {
                const activeUser = await Hospital.findByIdAndUpdate(user._id, {
                    active: true,
                })
                if (!activeUser) {
                    // console.log('Error occured while verifying')
                    req.flash('error_msg', 'Error occured while verifying')
                    res.redirect('/hospital/login')
                } else {
                    req.flash(
                        'success_msg',
                        'User has been verified and can login now'
                    )
                    //console.log('The user has been verified.')
                    //console.log('active', activeUser)
                    res.redirect('/hospital/login')
                }
            }
        })
    } catch (e) {
        // console.log(e)
        //signupMail(user,req.hostname,req.protocol)
        res.redirect('/hospital/login')
    }
}

module.exports.signup_post = async (req, res) => {
    const { licenseNumber,  hospitalName, email, phoneNumber,password, confirmPwd  } = req.body
    //console.log("in sign up route",req.body);
    if (!(!password || !confirmPwd) && (password != confirmPwd)) {
        req.flash('error_msg', 'Passwords do not match. Try again')
        res.status(400).redirect('/hospital/login')
        return;
    }

    try {
        const hospitalExists = await Hospital.findOne({ email })
        //console.log('userexists', userExists)
        /*if(userExists && userExists.active== false)
    {
      req.flash("success_msg",`${userExists.name}, we have sent you a link to verify your account kindly check your mail`)

      signupMail(userExists,req.hostname,req.protocol)
      return res.redirect("/signup")
    }*/
        if (hospitalExists) {
            req.flash(
                'success_msg',
                'This email is already registered. Try logging in'
            )
            return res.redirect('/hospital/login')
        }

        const hospital = new Hospital({ licenseNumber,  hospitalName, email, phoneNumber,password  })
        let saveUser = await hospital.save()
        //console.log(saveUser);
        req.flash(
            'success_msg',
            'Registration successful. Check your inbox to verify your email'
        )
        hospitalSignupMail(saveUser, req.hostname, req.protocol)
        //res.send(saveUser)
        res.redirect('/hospital/login')
    } catch (err) {
        const errors = handleErrors(err)
        // console.log(errors)

        var message = 'Could not signup. '.concat((errors['email'] || ""), (errors['password'] || ""), (errors['phoneNumber'] || ""), (errors["licenseNumber"] || ""),  (errors["hospitalName"] || ""),)
        //res.json(errors);
        req.flash(
            'error_msg',
            message
        )
        res.status(400).redirect('/hospital/signup')
    }
}
module.exports.login_get = (req, res) => {
    res.render("./hospitalViews/signup", { type:"login" }); 
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body
    // console.log('in Login route')
    // console.log('req.body',req.body)
    try {

        const hospital = await Hospital.login(email, password)

        const userExists = await Hospital.findOne({ email })
        

        if (!userExists.active) {
            const currDate = new Date();
            const initialUpdatedAt = userExists.updatedAt;
            const timeDiff = Math.abs(currDate.getTime() - initialUpdatedAt.getTime());
            if(timeDiff<=10800000)
            {
                // console.log("Email already sent check it")
                req.flash(
                    'error_msg',
                    `${userExists.hospitalName}, we have already sent you a verify link please check your email`)
                res.redirect('/hospital/login')
                return
            }
            req.flash(
                'success_msg',
                `${userExists.hospitalName}, your verify link has expired we have sent you another email please check you mailbox`
            )
            hospitalSignupMail(userExists, req.hostname, req.protocol)
            await Hospital.findByIdAndUpdate(userExists._id, { updatedAt: new Date() });
            //console.log('userExists',userExists)
            res.redirect('/hospital/login')
            return
        }
       
        const token = hospital.generateAuthToken(maxAge)

        res.cookie('hospital', token, { httpOnly: true, maxAge: maxAge * 1000 })
        //console.log(user);
        //signupMail(saveUser)
        req.flash('success_msg', 'Successfully logged in')
        res.status(200).redirect('/hospital/profile')
    } catch (err) {
        req.flash('error_msg', 'Invalid Credentials')
        //console.log(err)
        res.redirect('/hospital/login')
    }
}


module.exports.logout_get = async (req, res) => {
    
    res.clearCookie('hospital')
    req.flash('success_msg', 'Successfully logged out')
    res.redirect('/hospital/login')
}

module.exports.relation_post=async (req,res)=>{
    
    try{
    const{shortId}=req.params; 
    const user=await User.findOne({short_id: shortId})
    // console.log('userRels',user)
    if(!user)
    {
        // console.log('user not found')
        req.flash("error_msg", "User not found")
        res.redirect("/hospital/profile")
        return
    }
    //console.log('user',user)
    const hospitalId=req.hospital._id
    const userId=user._id
    // console.log('hospital current',req.hospital)

    const existRelation=await Relations.findOne({'userId':userId,'hospitalId':hospitalId})
    //const userRel= await Relations.findOne(userId)
    //console.log('userRel',userId)
    // console.log('existRelation',existRelation)
    if(existRelation) 
    {

        // console.log('relation already exists')
        if(existRelation.isPermitted)
        {
            // console.log('The user already exists',existRelation) //NEED TO IMPLEMENT SEARCH 
            req.flash('error_msg','The user is already registered in your hospital')
            res.redirect('/hospital/profile')
        }
        else{
            // console.log('the user has not given access')
            req.flash("error_msg", "The user is yet to respond to your request for access")
            res.redirect('/hospital/profile')
            //relationMail(existRelation,user,req.hostname,req.protocol)
        }
    }
    else{
    //console.log('hospital',hospital)
    let relation = await new Relations({
        hospitalId,
        userId
    }).save()
    if(!relation)
    {
        // console.log('unable to create link')
        req.flash("error_msg", "There was an error in creating request link")
        return res.redirect('/hospital/profile')
    }
    relationMail(relation,user,req.hostname,req.protocol)
    req.flash('success_msg','The user has been notified of your request for access. Awaiting user response')
    return res.redirect('/hospital/profile')
    //console.log('relation',relation)

    }
    }
    catch(e)
    {
        // console.log(e)
    }

}




module.exports.patient_search = async (req, res) => 
{
    const {short_id} = req.body; 
    // console.log("Searched patient", req.body);
    if (!short_id || short_id.length < 8)
    {
        req.flash("error_msg", "Unique ID of user cannot be less than 8 characters")
        res.redirect("/hospital/profile")
        return 
    }
    try
    {
        const result = await User.findOne({short_id}).populate("nominee")
        //console.log('resukts',result)
        if (result === null)
        {
            req.flash('error_msg', 'No such user exists'); 
            res.redirect("/hospital/profile")
            return 

        }  
        else
        {
            
            res.locals.hospital = req.hospital;
           
            const patients = await Relations.find({'isPermitted': true, 'hospitalId': req.hospital._id}, "userId").populate('userId', 'name'); 
            const access= await Relations.find({'userId':result._id, 'hospitalId':req.hospital._id, 'isPermitted':true }).populate('userId','isPermitted'); 
        //    console.log('searched patient',access);
        //    console.log("Found patient that I am passing into the ejs file", result);
           const custom_flash = "User found"; 
            res.render("./hospitalViews/profile", {path:'/hospital/search', patients:patients,access:access, foundUser:result, custom_flash:custom_flash });
            return 

        }

    }
    catch
    {
    //  console.log("Internal error while searching for patient"); 
     req.flash('error_msg', 'Could not execute search operation')
     res.redirect("/hospital/profile"); 
    }
}



module.exports.relationVerify_get = async (req, res) => {
    try {
        const relationID = req.params.id
        // console.log('relation',relationID)
        const expiredTokenUser = await Relations.findOne({ _id: relationID })
        const token = req.query.tkn
        //console.log(token)
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                req.flash(
                    'error_msg',
                    ' Your verify link had expired. We have sent you another verification link'
                )
                relationMail(expiredTokenUser, req.hostname, req.protocol)
                return res.redirect('/user/profile')
            }
            const relation = await Relations.findOne({ _id: decoded.id })
            if (!relation) {
                //console.log('user not found')
                res.redirect('/user/profile')
            } else {
                const activeRelation = await Relations.findByIdAndUpdate(relation._id, {
                    isPermitted: true,
                })
                if (!activeRelation) {
                    // console.log('Error occured while verifying')
                    req.flash('error_msg', 'Error occured while verifying')
                    res.redirect('/user/profile')
                } else {
                    req.flash(
                        'success_msg',
                        'Access rights granted'   
                    )
                    //console.log('The user has been verified.')
                    //console.log('active', activeUser)
                    res.redirect('/user/profile')
                }
            }
        })
    } catch (e) {
        // console.log(e)
        //signupMail(user,req.hostname,req.protocol)
        res.redirect('/hospital/profile')
    }
}


module.exports.mail_to_nominee =   async (req,res)=>{
    
    try{
    const{shortId}=req.params; 
    const user=await  User.findOne({short_id: shortId}).populate("nominee"); 
    const nominee = user.nominee; 
    // console.log(nominee);
    // console.log('user I found',user)
    if(!user)
    {
        // console.log('user not found')
        req.flash("error_msg", "User not found")
        res.redirect("/hospital/profile")
        return
    }
    if (!nominee)
    {
        // console.log('User has no nominee')
        req.flash("error_msg", "User has no nominee")
        res.redirect("/hospital/profile")
        return
    }

   
    //console.log('user',user)
    const hospitalId=req.hospital._id
    const userId=user._id
    // console.log('hospital current',req.hospital)

    const existRelation=await Relations.findOne({'userId':userId,'hospitalId':hospitalId})
    //const userRel= await Relations.findOne(userId)
    //console.log('userRel',userId)
    // console.log('existRelation',existRelation)
    if(existRelation) 
    {

        // console.log('relation already exists')
        if(existRelation.isPermitted)
        {
            // console.log('The user already exists',existRelation) //NEED TO IMPLEMENT SEARCH 
            req.flash('error_msg','The user is already registered in your hospital')
            res.redirect('/hospital/profile')
        }
        else{
            // console.log('the user has not given access')
            req.flash("error_msg", "The user is yet to respond to your request for access")
            res.redirect('/hospital/profile')
            //relationMail(existRelation,user,req.hostname,req.protocol)
        }
    }
    else{
    //console.log('hospital',hospital)
    let relation = await new Relations({
        hospitalId,
        userId
    }).save()
    if(!relation)
    {
        // console.log('unable to create link')
        req.flash("error_msg", "There was an error in creating request link")
        return res.redirect('/hospital/profile')
    }
    nomineeMail(relation,nominee,user, req.hostname,req.protocol)
    req.flash('success_msg','The nominee has been notified of your request for access. Awaiting user response')
    return res.redirect('/hospital/profile')
    //console.log('relation',relation)

    }
    }
    catch(e)
    {
        // console.log(e)
    }

}

module.exports.nomineeVerify_get = async (req, res) => {
    try {
        const relationID = req.params.id
        // console.log('relation',relationID)
        const expiredTokenUser = await Relations.findOne({ _id: relationID }).populate('userId'); 
        
        const token = req.query.tkn
        //console.log(token)
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                req.flash(
                    'error_msg',
                    ' Your verify link had expired. We have sent you another verification link'
                )
                
                const user = expiredTokenUser.userId;
                const userDetails = await user.populate('nominee').execPopulate(); 
                const nominee = userDetails.nominee; 
                // console.log("nominee email fail ", nominee)
                // console.log("Not able to send mail to nominee again"); 
                relationMail(expiredTokenUser, nominee, req.hostname, req.protocol)
                return res.redirect('/')
            }
            const relation = await Relations.findOne({ _id: decoded.id })
            if (!relation) {
                //console.log('user not found')
                res.redirect('/')
            } else {
                const activeRelation = await Relations.findByIdAndUpdate(relation._id, {
                    isPermitted: true,
                })
                if (!activeRelation) {
                    // console.log('Error occured while verifying')
                    req.flash('error_msg', 'Error occured while verifying')
                    res.redirect('/')
                } else {
                    req.flash(
                        'success_msg',
                        'Access rights of your kin granted'   
                    )
                    //console.log('The user has been verified.')
                    //console.log('active', activeUser)
                    res.redirect('/')
                }
            }
        })
    } catch (e) {
        // console.log(e)
        //signupMail(user,req.hostname,req.protocol)
        res.redirect('/')
    }
}
module.exports.picupload_post=async(req,res)=>{
    const hospital=req.hospital
    const picPath=hospital.profilePic
    Hospital.findOneAndUpdate({_id: hospital._id}, {$set:{profilePic:picPath}}, {new: true}, (err, doc) => {
        if (err) {
            console.log("Something wrong when updating data!");
            req.flash("error_msg", "Something wrong when updating data!")
            res.redirect('/hospital/profile')
        }
        
        // console.log(doc);
    });
    res.redirect('/hospital/profile')
}