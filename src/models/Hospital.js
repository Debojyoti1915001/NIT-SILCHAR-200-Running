const mongoose = require('mongoose')
// const validator = require('validator')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const utilities = require('../utilities/Utilities')
const { isEmail } = require('validator')
require('dotenv').config()

const hospitalSchema = mongoose.Schema(
    {
        licenseNumber:{
            type: String,
            trim: true,
            required: [true, 'License number field cannot be empty'] 
        },
        hospitalName: {
            type: String,
            trim: true, 
            required:[true, 'Hospital name field cannot be empty'], 
        },
        adminName: {
            type: String,
            trim: true
        },
        adminEmail: {
            type: String,
            trim: true
        },
        adminAddress: {
            type: String,
            trim: true
        },
        active: {
            type: Boolean,
            default: true,// to be set to false after testing
        },
        email: {
            type: String,
            trim: true,
            unique: true,
            required: [true, 'Email field cannot be empty'], 
            validate: [isEmail,'Email is invalid']
        },
        phoneNumber: {
            type: String,
            trim: true,
            required:[true, 'Phone number field cannot be empty'], 
            validate: [utilities.phoneValidator, 'Phone Number is invalid']
        },
        profilePic: {
            type: String,
            trim: true,
        },
        password: {
            type: String,
            required:[true, 'Password field cannot be empty'],
            trim: true,
            validate: [
                ( pass ) => {
                    return utilities.checkPasswordStrength( pass ) >= 4
                },
                'The password must contain a mix of uppercase and lowercase alphabets along with numbers and special chacracters'
            ]
        }
    },
    {
        timestamps : true
    }
)

// Creating token for hospital
hospitalSchema.methods.generateAuthToken = function generateAuthToken(maxAge){
    let id = this._id
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge,
    })
}

//deleting the passsword before sending
hospitalSchema.methods.toJSON = function () {
    const user = this
    const userObject = user.toObject()

    delete userObject.password
    return userObject
}

hospitalSchema.statics.login = async function (email, password) {
    const hospital = await this.findOne({ email })
    if (hospital) {
        const auth = await bcrypt.compare(password, hospital.password)
        if (auth) {
            return hospital
        }
        throw Error('Invalid Credentials')
    }
    throw Error('Invalid Credentials')
}


//To hash the password
hospitalSchema.pre('save', async function (next) {
    const salt = await bcrypt.genSalt()
    this.password = await bcrypt.hash(this.password, salt)
    next()
})




const Hospital = mongoose.model('Hospital', hospitalSchema)
module.exports = Hospital; 