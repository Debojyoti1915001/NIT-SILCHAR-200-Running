const User = require('../models/User')
const Hospital = require('../models/Hospital')
const jwt = require('jsonwebtoken')
const { signupMail,passwordMail } = require('../config/nodemailer')
const path = require('path')
const Disease = require('../models/Disease')
const Nominee = require('../models/Nominee')
const Relations=require('../models/Relations')
const { handleErrors,generateShortId } = require('../utilities/Utilities'); 
const crypto = require('crypto')
require('dotenv').config()
const { nanoId } = require("nanoid")
const mongoose=require('mongoose')
const Group = require('../models/Group')
const Post = require('../models/Post')
const cloudinary = require('cloudinary').v2
cloudinary.config({
    cloud_name:process.env.Cloud_Name,
    api_key:process.env.API_Key,
    api_secret:process.env.API_Secret
})
const maxAge = 30 * 24 * 60 * 60


module.exports.editDetails_post=async(req,res)=>{
    try{
    console.log("details",req.body)
    const name =req.body.nomineeName
    const email=req.body.nomineeEmail
    const phoneNumber=req.body.nomineePhn
    // console.log("name,phn,email",name,email,phoneNumber)
    // console.log("name,phn,email",name,email,phoneNumber)
    
    const address= req.body.address
    const bloodGroup= req.body.bloodGroup
    const user=req.user
    user.address=address
    user.bloodGroup=bloodGroup
    //await user.save()
    console.log(user)
    let nominee = await new Nominee({ 
        name,
        email,
        phoneNumber
    }).save()
    if (!nominee) {
        req.flash('error_msg', 'Unable to save the details')
        return res.redirect('/user/profile')
    }
    console.log('nominee',nominee)
    
    req.user.nominee = nominee._id
    await user.save()
    // console.log("user saved",user)
    req.flash('success_msg','Details about the user has been saved')
      

    res.redirect('/user/profile')
    }
    catch(e){
        // console.log("error",e)
        req.flash('error_msg','error while editing profile details')
        res.redirect('/user/profile')
    }
}


module.exports.userHospital_get= async (req,res)=>{
    const hsopitalId=req.query
    const params=new URLSearchParams(hsopitalId)
    const newId=params.get('id')
    // console.log(newId);
    res.locals.user = await req.user.populate('disease').execPopulate()
    //const newId=JSON.parse(userId,true)
    const hospital=await Hospital.findOne({'_id':newId});
//    console.log('user details',userHospital)
    
    //  console.log("hospital", user)
    const hospitals = await Relations.find({'userId':req.user._id,'isPermitted':true},"hospitalId").populate('hospitalId','hospitalName')
    // console.log('relation',hospitals)
    if(!hospital)
    {
        req.flash('error_msg','user not found')
        res.redirect('/user/profile')
    }
    res.render("./userViews/profile",{
        path:'/user/userHospital',
        hospitals,
        hospital
    })
}



// controller actions
module.exports.signup_get = (req, res) => {
    res.render('./userViews/signup',{
        type: 'signup'
    })
}

module.exports.login_get = (req, res) => {
    res.render('./userViews/signup',{
        type: 'login'
    })
}

module.exports.signup_post = async (req, res) => {
    const { name, email, password, confirmPwd, phoneNumber } = req.body
    const nominee=null
    // console.log("in sign up route",req.body);
    if (password != confirmPwd) {
        req.flash('error_msg', 'Passwords do not match. Try again')
        res.status(400).redirect('/user/login')
        return
    }

    try {
        const userExists = await User.findOne({ email })
        // console.log('userexists', userExists)
        /*if(userExists && userExists.active== false)
    {
      req.flash("success_msg",`${userExists.name}, we have sent you a link to verify your account kindly check your mail`)

      signupMail(userExists,req.hostname,req.protocol)
      return res.redirect("/signup")
    }*/
        if (userExists) {
            req.flash(
                'success_msg',
                'This email is already registered. Try logging in'
            )
            return res.redirect('/user/login')
        }
        const short_id =  generateShortId(name,phoneNumber);
        // console.log("Short ID generated is: ", short_id)
        const user = new User({ email, name, password, phoneNumber, short_id ,nominee})
        let saveUser = await user.save()
        // console.log(saveUser);
        req.flash(
            'success_msg',
            'Registration successful. Check your inbox to verify your email'
        )
        signupMail(saveUser, req.hostname, req.protocol)
        //res.send(saveUser)
        res.redirect('/user/login')
    } catch (err) {
        const errors = handleErrors(err)
        // console.log(errors)

        var message = 'Could not signup. '.concat((errors['email'] || ""), (errors['password'] || ""), (errors['phoneNumber'] || ""),(errors['name'] || "")  )
        //res.json(errors);
        req.flash(
            'error_msg',
            message
        )
        res.status(400).redirect('/user/signup')
    }
}
module.exports.emailVerify_get = async (req, res) => {
    try {
        const userID = req.params.id
        const expiredTokenUser = await User.findOne({ _id: userID })
        const token = req.query.tkn
        // console.log(token)
        jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
            if (err) {
                req.flash(
                    'error_msg',
                    ' Your verify link had expired. We have sent you another verification link'
                )
                signupMail(expiredTokenUser, req.hostname, req.protocol)
                return res.redirect('/user/login')
            }
            const user = await User.findOne({ _id: decoded.id })
            if (!user) {
                // console.log('user not found')
                res.redirect('/')
            } else {
                const activeUser = await User.findByIdAndUpdate(user._id, {
                    active: true,
                })
                if (!activeUser) {
                    // console.log('Error occured while verifying')
                    req.flash('error_msg', 'Error occured while verifying')
                    res.redirect('/')
                } else {
                    req.flash(
                        'success_msg',
                        'User has been verified and can login now'
                    )
                    // console.log('The user has been verified.')
                    // console.log('active', activeUser)
                    res.redirect('/user/login')
                }
            }
        })
    } catch (e) {
        // console.log(e)
        //signupMail(user,req.hostname,req.protocol)
        res.redirect('/user/login')
    }
}

module.exports.login_post = async (req, res) => {
    const { email, password } = req.body
    // console.log('in Login route')
    //  console.log('req.body',req.body)
    try {

        const user = await User.login(email, password)
        // console.log("user",user)

        const userExists = await User.findOne({ email })  
    //    console.log("userexsits",userExists)
       

        if (!userExists.active) {
            const currDate = new Date();
            const initialUpdatedAt = userExists.updatedAt;
            const timeDiff = Math.abs(currDate.getTime() - initialUpdatedAt.getTime());
            if(timeDiff<=10800000)
            {
                // console.log("Email already sent check it")
                req.flash(
                    'error_msg',
                    `${userExists.name}, we have already sent you a verify link please check your email`)
                res.redirect('/user/login')
                return
            }
            req.flash(
                'success_msg',
                `${userExists.name}, your verify link has expired we have sent you another email please check you mailbox`
            )
            signupMail(userExists, req.hostname, req.protocol)
            await User.findByIdAndUpdate(userExists._id, { updatedAt: new Date() });
            // console.log('userExists',userExists)
            res.redirect('/user/login')
            return
        }
       
        const token = user.generateAuthToken(maxAge)

        res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 })
        // console.log(user);
        //signupMail(saveUser)
    //    console.log("logged in")
        req.flash('success_msg', 'Successfully logged in')
        res.status(200).redirect('/user/profile')
    } catch (err) {
        req.flash('error_msg', 'Invalid Credentials')
        // console.log(err)
        res.redirect('/user/login')
    }
}

module.exports.upload_post = async (req, res) => {

    // console.log("in uploads",req.body)
    
    try {
        
        let { name } = req.body
       
        const files = req.files
        dname=name.toLowerCase()
        const obj = JSON.parse(JSON.stringify(files))
        // console.log("files",obj)
        // console.log(obj.document[0].filename)
        if(Object.keys(obj).length===0)
        {
            req.flash('error_msg','You may have not submitted any file or the file type may not be supported. Please try jpg,jpeg,pdf files')
            return res.redirect('/user/profile')
        }
        if(name==='')
        {
            req.flash('error_msg','Disease name cant be empty')
            return res.redirect('/user/profile')
        }
        const userDisease= await req.user.populate('disease','name').execPopulate()
        // console.log('disease',userDisease)
        const existName=userDisease.disease.find(data=>
            data.name===dname
        )
        // console.log('disease',existName)

        const document={
        originalName:'',
        filename:''
        }
        const medicine={
        originalName:'',
        filename:''
        }


        if(existName)
        {
            
            const existDisease= await Disease.findById({'_id':existName._id})
            // console.log('exist disease',existDisease)
          
            if(obj.medicine)
            {
                //medicine[0]._id= mongoose.Types.ObjectId()
                medicine.originalName=obj.medicine[0].originalname
                medicine.filename=`/uploads/${req.user.email}/${dname}/${obj.medicine[0].filename}`
                existDisease.medicine.push(medicine)
            }
            if(obj.document)
            {
                //document[0]._id=mongoose.Types.ObjectId()
                document.originalName=obj.document[0].originalname
                document.filename=`/uploads/${req.user.email}/${dname}/${obj.document[0].filename}`
                existDisease.document.push(document)
            }
            await existDisease.save()
            req.flash('success_msg','Disease name already exists, file succesfully uploaded')
            return res.redirect('/user/profile')
        }
        
        /*let images = files.map((file) => {
            return `/uploads/${req.user.email}/${file.filename}`
        })*/
       

           
        let newDisease = await new Disease({ 
            name
        }).save()
        if(obj.medicine)
        {
            medicine.originalName=obj.medicine[0].originalname
            medicine.filename=`/uploads/${req.user.email}/${dname}/${obj.medicine[0].filename}`
            newDisease.medicine.push(medicine)
            
           // medicine.push(`/uploads/${req.user.email}/${dname}/${obj.medicine[0].filename}`)
        }
        if(obj.document)
        {
            document.originalName=obj.document[0].originalname
            document.filename=`/uploads/${req.user.email}/${dname}/${obj.document[0].filename}`
            newDisease.document.push(document)
            //await newDisease.save()
            //document.push( `/uploads/${req.user.email}/${dname}/${obj.document[0].filename}`)
        }
        await newDisease.save()

        // console.log('documents',document)
        // console.log('medicine',medicine)
        
        if (!newDisease) {
            req.flash('error_msg', 'Unable to save the disease details, Please check the file format. Supported file formats are:jpeg,jpg,png,gif,pdf')
            return res.redirect('/user/profile')
        }
        req.user.disease.push(newDisease)
        await req.user.save()

        // console.log(newDisease)
        req.flash('success_msg', 'Sucessfully uploaded disease details.')
        return res.redirect('/user/profile')
    } catch (err) {
        // console.log("error")
        // console.error(err)
        req.flash('error_msg', 'Something went wrong')
        return res.redirect('/user/profile')
    }
}


module.exports.disease_get=async(req,res)=>{
    const userId=req.query
    const params=new URLSearchParams(userId)
    const id=params.get('id')
    const disease=await Disease.findOne({_id:id})
    // console.log("disease",disease)
    const hospitals = await Relations.find({'userId':req.user._id,'isPermitted':true}).populate('hospitalId','hospitalName')    
    // console.log('user',req.user)
    res.locals.user= await req.user.populate('disease').execPopulate()
    // console.log('diseases',Userdiseases)
    res.render('./userViews/profile', {
        path: '/user/disease',
        hospitals,
        disease
      })
    //   console.log("in disease page")
    }

module.exports.profile_get = async (req, res) => {
    //res.locals.user = req.user
    res.locals.user = await req.user.populate('disease').execPopulate()
    // console.log('user id',req.user)
    // console.log("locals",res.locals.user)
    // console.log('id',req.user._id)
    // const user=req.user
    const hospitals = await Relations.find({'userId':req.user._id,'isPermitted':true}).populate('hospitalId','hospitalName')
    const nominee= await req.user.populate('nominee').execPopulate()// to be optimised by gaurav
    // console.log('hospitals',nominee)
    // const profilePath=path.join(__dirname,`../../public/uploads/${user.email}/${user.profilePic}`)
    // console.log(profilePath)
    res.render('./userViews/profile', {
        path: '/user/profile',
        hospitals:hospitals,
        nominee,
        // profilePath
      })
    //   console.log("in profile page")
    }

module.exports.logout_get = async (req, res) => {
    // res.cookie('jwt', '', { maxAge: 1 });
    // const cookie = req.cookies.jwt
    res.clearCookie('jwt')
    req.flash('success_msg', 'Successfully logged out')
    res.redirect('/user/login')
} 

// module.exports.upload_get =async (req, res) => {
//   res.render("multer")
// }

module.exports.getForgotPasswordForm = async (req, res) => {
    res.render('./userViews/forgotPassword')
}

module.exports.getPasswordResetForm = async (req, res) => {
    const userID=req.params.id;
    const user = await User.findOne({ _id: userID })
    const resetToken = req.params.token
    res.render('./userViews/resetPassword', {
        userID,
        resetToken,
    })
}

module.exports.forgotPassword = async (req, res) => {
    const email=req.body.email
    const user = await User.findOne({ email })
    if (!user) {
        req.flash('error_msg', 'No user found')
        return res.redirect('/user/login')
    }
    // console.log(user)
    const userID = user._id
    
    const dt = new Date(user.passwordResetExpires).getTime()
    if (
        (user.passwordResetToken && dt > Date.now()) ||
        !user.passwordResetToken
    ) {
        const resetToken = user.createPasswordResetToken()
        // console.log(user.passwordResetExpires)
        // console.log(user.passwordResetToken)
        await user.save({ validateBeforeSave: false })
        try {
            passwordMail(user,resetToken,req.hostname, req.protocol)
            req.flash('success_msg', 'Email sent,please check email')
            res.redirect('/user/forgotPassword')
        } catch (err) {
            user.passwordResetToken = undefined
            user.passwordResetExpires = undefined
            await user.save({ validateBeforeSave: false })
            req.flash('error_msg', 'Unable to send mail')
            res.redirect('/user/forgotPassword')
        }
    } else {
        req.flash('error_msg', 'Mail already send,please wait for sometime to send again')
        res.redirect('/user/forgotPassword')
    }
}

module.exports.resetPassword = async (req, res) => {
    try {
        const token=req.params.token
        const id=req.params.id
        const hashedToken = crypto
            .createHash('sha256')
            .update(req.params.token)
            .digest('hex')
        const user = await User.findOne({
            _id: req.params.id,
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        })
        if (!user) {
            req.flash('error_msg', 'No user found')
            return res.redirect('/user/login')
        }
        if(req.body.password!==req.body.cpassword){
          req.flash('error_msg','Passwords dont match') 
          return res.redirect(`resetPassword/${id}/${token}`)
        }else{
            
        user.password = req.body.password
        user.passwordResetToken = undefined
        user.passwordResetExpires = undefined
        await user.save()
        const JWTtoken = await user.generateAuthToken(maxAge)
        // user = user.toJSON()
        res.cookie('jwt', JWTtoken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: false,
        })
        res.redirect('/user/profile')
 
        }
   } catch (err) {
        res.send(err)
    }
}
module.exports.hospitalSearch_get=async(req,res)=>{
    const userId=req.query
    const params=new URLSearchParams(userId)
    const id=params.get('id')
    const hospitals=await Hospital.find({ _id:id})
    // console.log(hospitals)
    // res.send(hospital)
    const nominee= await req.user.populate('nominee').execPopulate()
    // console.log('nomineeeee',nominee)
    res.locals.user=req.user
    res.render("./userViews/Profile",{
        hospitals,
        nominee,
        path:'/user/userHospitalD'
    })
}
module.exports.hospitalSearch_post=async(req,res)=>{
    const hospitalName = req.body.hname
    // console.log(hospitalName) 

    if (!hospitalName)
    {
        req.flash("error_msg", "Enter a value")
        res.redirect("/user/profile")
        return 
    }
    try
    {
        const hospital = await Hospital.find({hospitalName:hospitalName})
    //    console.log('resukts',hospital)
        if (hospital.length === 0)
        {
            req.flash("error_msg", "No such hospital exists")
            res.redirect("/user/profile")
            return 

        }  
        else
        {
            req.flash("success_msg", "Hospital found")
            res.locals.user = await req.user.populate('disease').execPopulate()
            const hospitals = await Relations.find({'userId':req.user._id,'isPermitted':true}).populate('hospitalId','hospitalName')
            const nominee= await req.user.populate('nominee').execPopulate()
            // console.log(hospitals)
            // console.log(hospitals)
            res.render("./userViews/profile", {
            path:'/user/hospitalSearch', 
            hospitals, 
            nominee,
            hospital })
            return 

        }

    }
    catch
    {
    //  console.log("Internal error while searching for hospital"); 
     req.flash("error_msg", "error while searching for hospital")
     res.redirect("/user/profile"); 
    }
    
}
module.exports.download=async(req,res)=>{
    const downloadpdf=req.query
    const params=new URLSearchParams(downloadpdf)
    const pathp=params.get('pdfdownload')
    var parts = pathp.split("/");
    var result = parts[parts.length - 1]//to get the file name
    const type=req.params.type//to get the type wheather 'medical/documnet'
    let reqPath = path.join(__dirname, `../../public/${pathp}/../${type}/${result}`)
    // console.log(reqPath) 
    res.download(reqPath, (error)=>{
        if(error){
            req.flash("error_msg", "error while downloading")
            // console.trace(error)
            return res.redirect('/user/profile')
        }
        res.end()
      })

}
module.exports.picupload_post=async(req,res)=>{
    const user=req.user
    const picPath=user.profilePic
    User.findOneAndUpdate({_id: user._id}, {$set:{profilePic:picPath}}, {new: true}, (err, doc) => {
        if (err) {
            // console.log("Something wrong when updating data!");
            req.flash("error_msg", "Something wrong when updating data!")
            res.redirect('/user/profile')
        }
        
        // console.log(doc);
    });
    res.redirect('/user/profile')
}
//start
module.exports.createGroup_post = async (req, res) => {
    const id=req.user._id
    // console.log(id)
    const { name, desc } = req.body
    // console.log(name,':',desc)
    try {
        const groupExists = await Group.findOne({ name })
        
        if (groupExists) {
            req.flash(
                'success_msg',
                'This name already exist'
            )
            return res.redirect('/')//to be changed to groups landing page route
        }
        let arrayUsers=[id];
        const group = new Group({  name, desc,arrayUsers,visibility:0})
        let groupUser = await group.save()


         console.log(groupUser);
        req.flash(
            'success_msg',
            'Group Added'
        )
        //res.send(saveUser)
        res.redirect('/')
    } catch (err) {
        // console.log(errors)
        req.flash(
            'error_msg',
            'Failed'
        )
        res.status(400).redirect('/')
    }
}
module.exports.onboarding_post = async (req, res) => {
    const user=req.user
    //how we pass matters
    const { color, favCeleb } = req.body
    // console.log(color,':',favCeleb)
    try {
        
        await User.findOneAndUpdate({_id: user._id}, {$set:{color}}, {new: true}, (err, doc) => {
            if (err) {
                // console.log("Something wrong when updating data!");
                req.flash("error_msg", "Something wrong when updating data!")
                res.redirect('/')
            }
            
            // console.log(doc);
        });
        await User.findOneAndUpdate({_id: user._id}, {$set:{favCeleb}}, {new: true}, (err, doc) => {
            if (err) {
                // console.log("Something wrong when updating data!");
                req.flash("error_msg", "Something wrong when updating data!")
                res.redirect('/')
            }
            
            // console.log(doc);
        });
        console.log(req.user)
        req.flash(
            'success_msg',
            'Details added'
        )
        //res.send(saveUser)
        res.redirect('/')
    } catch (err) {
        // console.log(errors)
        req.flash(
            'error_msg',
            'Failed'
        )
        res.status(400).redirect('/')
    }
}
module.exports.postinGroup_post=async (req, res) => {
    // const groupId=req.query
    // 61784d0307a9ec177861ea70
    // const params=new URLSearchParams(groupId)
    // const id=params.get('id')
    const id = req.params.id
    const { name, desc } = req.body
    const picture =req.file.path
    var pic=null
    await cloudinary.uploader.upload(picture,function(err,res){
        // console.log(res)
        pic=res.secure_url
        console.log(pic)
    })
    try {
        if(name.length==0||desc.length==0){
            req.flash(
                'error_msg',
                'Enter name and desc'
            )
            res.redirect('/')
        }
        else{
        const post = new Post({ name, desc,pic})
        console.log(post)
        let savePost = await post.save()
        const groupExists = await Group.findOne({ _id:id })
        // console.log(groupExists)
        const posts=groupExists.post
        posts.push(id)
        await Group.findOneAndUpdate({_id: id}, {$set:{post:posts}}, {new: true}, (err, doc) => {
            if (err) {
                req.flash("error_msg", "Something wrong when updating data!")
                res.redirect('/')
            }
            
        });
        req.flash(
            'success_msg',
            'Post Added'
        )
        //res.send(saveUser)
        res.redirect('/')
        }
    } catch (err) {
        // console.log(errors)
        req.flash(
            'error_msg',
            'Failed'
        )
        res.status(400).redirect('/')
    }
}