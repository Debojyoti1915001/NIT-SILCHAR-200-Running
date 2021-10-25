const mongoose = require('mongoose')
// const User = require('../models/User')


const diseaseSchema = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    medicine:[{
        originalName:{
            type:String
        },
        filename:{
            type:String
        }
    }],
    document:[{
        originalName:{
            type:String
        },
        filename:{
            type:String
        }
    }],
    owner:{
        type: mongoose.Schema.Types.ObjectId ,
        ref:'User'
    }
})

/*diseaseSchema.virtual('owner',{
    ref:'User',
    localField:'_id',
    foreignField:'disease'
})*/

const Disease = mongoose.model('Disease', diseaseSchema)

module.exports = Disease
