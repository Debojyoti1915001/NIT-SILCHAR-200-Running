const mongoose = require('mongoose')

const post = mongoose.Schema({
    name: {
        type: String,
        trim: true,
    },
    content:{
        type: String,
        trim : true
    },
    comments :[ {
        type: String,
        trim : true
    }],
    like : {
        type : Number,
    },
    pic:{
        type: String
    }
})

const Post = mongoose.model('Post', post)

module.exports = Post
