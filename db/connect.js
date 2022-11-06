const mongoose = require('mongoose')
require('dotenv').config();

const CreateConnection = async () =>{
    try{
        const URL = process.env.MongoURI
        //console.log(URL)
        await mongoose.connect(URL)
        console.log("connected to DB")
    }
    catch(err){
        console.log(err)
    }
    
}

module.exports = CreateConnection