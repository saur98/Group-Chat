const express  = require('express')
const User = require('../../db/Schema/User')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express()

app.post("/login",async (req,res) => {
    try{
    const user_data = req.body
    let email = user_data.email
    const salt = await bcrypt.genSalt(10);
    const existing_user = await User.findOne({email})
    if(existing_user){
        //console.log(user_data.pass,existing_user)
        if(await bcrypt.compare(user_data.pass,existing_user.pass)){
            const payload = {
                user : {
                    id : existing_user.id,
                    privilege : existing_user.privilege
                }
            }
            
            jwt.sign(
                payload,
                process.env.jwtSecret,
                (err,token) => {
                    if(err) throw error;
                    res.send({token});
                }
            )
            //res.status(200).send(existing_user._id); // missing JWT
        }
        else{
            res.status(401).send("Unauthorized");
        }
    }
    else{
        res.status(404).send("user not found");
    }
    }
    catch(err){
        console.log(err)
    }

});

app.get("/logout",(req,res) => {
    //delete session
})

module.exports = app