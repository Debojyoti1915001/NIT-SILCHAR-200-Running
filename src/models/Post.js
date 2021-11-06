const mongoose = require('mongoose')

const post = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    desc:{
        type: String,
        trim : true
    },
    comments :[ 
        {
            content:{
                type: String,
                trim : true
            },
            postedBy:{
                type: String,
                trim : true
            },
        },

    ],
    like :[ {
        type : String,
    }],
    pic:{
        type: String
    },
    group: 
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
        },
        time:{
            type:String,
            default:'0'
        }
})

const Post = mongoose.model('Post', post)

module.exports = Post
