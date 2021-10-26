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
        type:Number,
        default: 0,
        // 0->public
        // 1->private
    }
})

const Group = mongoose.model('Group', group)

module.exports = Group
