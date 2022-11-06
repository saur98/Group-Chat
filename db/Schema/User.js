const mongoose = require('mongoose');

const User = mongoose.Schema({
    name : {
        type : String
    },
    email : {
        type : String,
        unique:true
    },
    pass : {
        type : String
    },
    privilege : {
        type : String
    }
})

module.exports = mongoose.model("GC_User",User);