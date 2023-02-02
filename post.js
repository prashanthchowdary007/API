const mongoose = require ('mongoose');

const post = mongoose.Schema({
    name:{
        type:String,
    },
    postcon:{
        type:String,
        required:true
    },
    title:{
        type:String,
        required:true
    }
})
module.exports= mongoose.model("postcontent", post)