const User= require('../models/User')
//const { isPermittedMail } = require('../config/nodemailer')

module.exports.relation_post=async (req,res)=>{
    
    try{
    const{email}=req.body
    const user=await User.findOne({email})
    if(!user)
    {
        console.log('user not found')
        return
    }
    // console.log('user',user)

    }
    catch(e)
    {
        console.log(e)
    }

}