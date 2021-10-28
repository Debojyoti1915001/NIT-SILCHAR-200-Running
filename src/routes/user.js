const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')
const { v4 } = require('uuid');
// const mkdirp=require('mkdirp')
//const upload= require('../controllers/authControllers')

//uploading files with multer
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log("in multer",file)
        if(file.fieldname==='photo'){
            const userEmail = req.user.email.toLowerCase()
            var dir = `./public/uploads/${userEmail}/${file.fieldname}`
        }
        else if(file.fieldname!=='profilePic'){
        const {name}=req.body 
        // console.log('disease name',name)
        //console.log('field',file.fieldname)
        const dname= name.toLowerCase()
        const userEmail = req.user.email.toLowerCase()
        var dir = `./public/uploads/${userEmail}/${dname}/${file.fieldname}`
        }else{
            const userEmail = req.user.email.toLowerCase()
            var dir = `./public/uploads/${userEmail}/${file.fieldname}`
            // console.log("dir:",dir)
        }
        if (!fs.existsSync(dir)) {
            //console.log("making files")
            fs.mkdirSync(dir, { recursive: true }, (err) => {
                if (err) console.error('New Directory Creation Error');
            })
        }
        cb(null, dir)
    },
    filename: (req, file, cb) => {
        // const userId = req.user._id

       // fileName= path.join(`${file.fieldname}`,`File-${v4()}-${file.originalname}-${path.extname(file.originalname)}`)
        //console.log(fileName)
        if(file.fieldname==='profilePic'){
        const user=req.user
        user.profilePic=`ProfilePic_${file.originalname}`
        cb(null,`ProfilePic_${file.originalname}` )
        }else{
        cb(null,`File-${v4()}-${file.originalname}` )
        }
    },
})

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 6000000 },
    fileFilter: function (req, file, cb) {
        if(file.fieldname==='profilePic'){
        checkFileType1(file, cb)
        }else{
        checkFileType(file, cb)
        }
    },
})
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|pdf/
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    )
    const mimetype = filetypes.test(file.mimetype)
    if (mimetype && extname) {
        return cb(null, true)
    } else {
        console.log("invalid file")
        // req.flash("error_msg", "Enter a valid picture of format jpeg jpg png") 
        return cb(null,false)
    }
}
function checkFileType1(file, cb) {
    const filetypes = /jpeg|jpg|png/
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    )
    const mimetype = filetypes.test(file.mimetype)
    if (mimetype && extname) {
        // console.log("invalid file")
        return cb(null, true)
    } else {
        // console.log("invalid file")
        // req.flash("error_msg", "Enter a valid picture of format jpeg jpg png") 
        cb(null,false)
        
    }
}

//uploading finishes
const authController = require('../controllers/authControllers')
const { requireAuth, redirectIfLoggedIn } = require('../middleware/userAuth')
router.get('/verify/:id', authController.emailVerify_get)
router.get('/signup',redirectIfLoggedIn, authController.signup_get)
router.post('/signup', authController.signup_post)
router.get('/login', redirectIfLoggedIn, authController.login_get)
router.post('/login', authController.login_post)
router.get('/logout', requireAuth, authController.logout_get)
router.get('/profile', requireAuth, authController.profile_get)

//For hackathon

//Add Group Feature
router.get('/createGroup', requireAuth, authController.createGroup_get)
router.post('/createGroup', requireAuth,upload.single('photo'), authController.createGroup_post)
router.post('/onboarding', requireAuth, authController.onboarding_post)
//Post in a Group
router.post('/postinGroup/:id', requireAuth,upload.single('photo'), authController.postinGroup_post)
router.post('/updatepost/:id', requireAuth, authController.updatePost_post)
// router.post('/deletepost', requireAuth, authController.deletePost_post)

//End


//router.get('/profileNew'/*, requireAuth,*/, authController.profileNew_get)






router.get('/forgotPassword', redirectIfLoggedIn,authController.getForgotPasswordForm)
router.post('/forgotPassword', redirectIfLoggedIn,authController.forgotPassword)
router.get('/resetPassword/:id/:token',authController.getPasswordResetForm)
router.post('/resetPassword/:id/:token',authController.resetPassword)
router.get('/download/:type/pdf',requireAuth,authController.download)
router.post(
    '/profile/picupload',
    requireAuth,
    upload.single(
            'profilePic',
      ),  
    authController.picupload_post
)
module.exports = router