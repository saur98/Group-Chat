const mongoose = require('mongoose')

const Group = mongoose.Schema({
    name : {
        type : String
    },
    created_date : {
        type : Date,
        default : Date.now()
    },
    members : {
        type : [{ type : mongoose.ObjectId, ref: 'GC_User' }]
    },
    messages : {
        type : [{ type : mongoose.ObjectId, ref: 'GC_Message' }],
    }
})

module.exports = mongoose.model("GC_Group",Group);