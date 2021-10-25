const mongoose = require('mongoose')

const contactUs = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    email:{
        type: String,
        trim : true
    },
    subject : {
        type: String,
        trim : true
    },
    message : {
        type : String,
        trim : true
    }
})

const Contact = mongoose.model('Contact', contactUs)

module.exports = Contact
