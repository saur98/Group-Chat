const express  = require('express')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../db/Schema/User')
const auth = require('../../auth/auth_admin.js')

const app = express()

app.post("/create-admin",async (req,res,next) => {
    try{
    user_data = req.body
    const salt = await bcrypt.genSalt(10);
    const final_data = {
        name:user_data.name,
        email:user_data.email, // validation on front-end
        pass:await bcrypt.hash(user_data.pass,salt), //(encryption missing)
        privilege : user_data.privilege
    }
    const user = new User(final_data)
    const new_user =  await user.save()
    console.log(new_user)
    const payload = {
        user : {
            id : user.id,
            privilege : user.privilege
        }
    }

    jwt.sign(
        payload,
        process.env.jwtSecret,
        (err,token) => {
            if(err) throw error;
            res.send({token,new_user});
        }
    )
}
catch(err){
    next(err)
}
    
    //console.log(user.save())
});


app.post("/create",auth,async (req,res,next) => {
    try{
        user_data = req.body
    const salt = await bcrypt.genSalt(10);
    const final_data = {
        name:user_data.name,
        email:user_data.email, // validation on front-end
        pass:await bcrypt.hash(user_data.pass,salt), //(encryption missing)
        privilege : user_data.privilege
    }
    const user = new User(final_data)
    const new_user =  await user.save()
    console.log("correct user")
    const payload = {
        user : {
            id : user.id,
            privilege : user.privilege
        }
    }
    
    jwt.sign(
        payload,
        process.env.jwtSecret,
        (err,token) => {
            if(err) throw error;
            res.send({token,new_user});
        }
    )
    }
    catch(err){
         next(err)
    }

});

app.put("/update",auth,async (req,res) => {
    user_data = req.body
    let email = user_data.email
    const final_data = {}

        if(user_data?.name)final_data.name=user_data.name
        if(user_data?.pass)final_data.pass=await bcrypt.hash(user_data.pass,salt)
        if(user_data?.privilege)final_data.privilege = user_data.privilege
         console.log(final_data)
    const existing_user = await User.findOneAndUpdate({email},final_data,{new:true})
    if(existing_user){

        res.send(existing_user)
    }
    else{
        res.status(404).send('User Not Found')
    }
});


app.use((err,req,res,next) => {
    console.log(err)
    res.send(err)
})

module.exports = app