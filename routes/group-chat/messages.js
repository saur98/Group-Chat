const express = require('express')
//const Server = require('socket.io')
const auth = require('../../auth/auth')
const Messages = require('../../db/Schema/Message')
const Group = require('../../db/Schema/Group')

const app = express()
//const io = new Server(3000)

app.get('/get-message',auth,async (req,res) => {
    let group_id = req.body.group
    const messages  = await Group.find({group_id},{'messages' : 1}).populate('messages').catch(console.log)
    res.status(200).send(messages)
})

app.post("/message",auth,async (req,res) => {
    const {message , group } = req.body
    const user = req.user
    const new_message = new Messages({
        user : user.id,
        message,
        likes : []
    })
    const message_received = await new_message.save()
    //console.log(message_received._id)
    await Group.findByIdAndUpdate(group,
        { $addToSet: { messages: [message_received._id] } },
    )
    res.send(message_received)
})



app.post("/like",auth,async (req,res) => {
    const {message_id} = req.body
    const user = req.user
    //console.log(messages)
    console.log(await Messages.findByIdAndUpdate(message_id,
        { $addToSet: { likes: [user.id] } },
    ))
    res.send("liked")
})

/*io.on('connection',(socket) => {

    socket.on("message",async ({jwt,group,message,time}) => {
        const new_message = new Messages({
            user : jwtCheck(jwt),
            message,
            time,
            likes : []
        })
        const message_received = await new_message.save()
        Group.findOneAndUpdate({group},
            { $addToSet: { messages: [message_received._id] } },
        )
    })

    socket.on("like",({jwt,message}) => {
        Messages.findOneByIdAndUpdate(message._id,
            { $addToSet: { likes: [jwtCheck(jwt)] } }
            )
    })

})*/

// async function userInGroup(user,group){
//     const users = 
// } 

module.exports = app