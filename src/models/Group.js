const mongoose = require('mongoose')

const group = mongoose.Schema({
    name: {
        type: String,
        trim: true,
        unique: true,
    },
    desc:{
        type: String,
    },
    pic:{
        type: String,
    },
    post: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Post',
        },
    ],
    arrayUsers:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
    ],
    visibility:{
        type:String,
        default: '0',
        // 0->public
        // 1->private
    },
    category:{
        type:String,
        default: '0',
    }
})

const Group = mongoose.model('Group', group)

module.exports = Group
