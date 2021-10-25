const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require('path')

const { requireAuth, redirectIfLoggedIn } = require("../middleware/hospitalAuth")


const hospitalController = require('../controllers/hospitalController')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // console.log("in multer",file)
            const hospitalEmail = req.hospital.email.toLowerCase()
            var dir = `./public/uploads/${hospitalEmail}/hospital/${file.fieldname}`
            // console.log("dir:",dir)
        
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
        const hospital=req.hospital
        hospital.profilePic=`ProfilePic_${file.originalname}`
        cb(null,`ProfilePic_${file.originalname}` )
        
    },
})

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 6000000 },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    },
})
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png/
    const extname = filetypes.test(
        path.extname(file.originalname).toLowerCase()
    )
    const mimetype = filetypes.test(file.mimetype)
    if (mimetype && extname) {
        return cb(null, true)
    } else {
        cb(null,false)
    }
}


router.get('/document',requireAuth,hospitalController.document_get)

router.get('/diseases',requireAuth,hospitalController.patientDiseases_get)
router.get('/signup',redirectIfLoggedIn, hospitalController.signup_get)
router.post('/signup', hospitalController.signup_post)
router.get('/relation/:shortId',requireAuth,hospitalController.relation_post)
router.get('/nominee/:shortId',requireAuth,hospitalController.mail_to_nominee)
router.get('/login', redirectIfLoggedIn, hospitalController.login_get)
router.get('/verify/:id', hospitalController.emailVerify_get)
router.get('/logout', requireAuth, hospitalController.logout_get)
router.post('/search', requireAuth, hospitalController.patient_search)
router.post('/login', hospitalController.login_post)
router.get('/verifyRelation/:id',hospitalController.relationVerify_get)
router.get('/verifyNominee/:id',hospitalController.nomineeVerify_get) 

router.post('/profile/editDetails',requireAuth, hospitalController.editDetails_post)

router.get('/profile', requireAuth, hospitalController.profile_get)

router.get('/patient',requireAuth,hospitalController.patient_get)
router.post(
    '/profile/picupload',
    requireAuth,
    upload.single(
            'profilePic',
      ),  
    hospitalController.picupload_post
)
module.exports = router