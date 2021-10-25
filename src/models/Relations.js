const mongoose =require('mongoose')

const relationsSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    hospitalId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Hospital'
    },
    isPermitted:{
        type:Boolean,
        default:true
    }

})

const Relations= mongoose.model('Relations',relationsSchema)
module.exports= Relations