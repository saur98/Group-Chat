const express = require('express')
const Group = require('../../db/Schema/Group')
const Message = require('../../db/Schema/Message')
const User = require('../../db/Schema/User')

const app = express()

app.get("/reset",(req,res) => {
    try{
    Group.collection.drop()
    Message.collection.drop()
    User.collection.drop()
    }
    catch(err){
        console.log(err)
    }
    res.send("done")
})

module.exports = app