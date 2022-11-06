const mongoose = require('mongoose')

const Message = mongoose.Schema({
    user : {
        type: mongoose.ObjectId, ref: 'User' 
    },
    message : {
        type : String
    },
    time : {
        type : Date,
        default : Date.now()
    },
    likes : {
        type : [{ type : mongoose.ObjectId, ref: 'User' }]
    }
})

module.exports = mongoose.model("GC_Message",Message);