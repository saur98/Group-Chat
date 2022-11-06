const express  = require('express');
const Group = require('../../db/Schema/Group');
const Messages = require('../../db/Schema/Message');
const auth = require('../../auth/auth')

const app = express()

app.post("/create",auth,async(req,res) => {
    //const data = req.body
    const creator = req.user
    console.log(creator)
    const {members , name } = req.body
    const group = new Group({
        name ,
        members : [...members,creator.id],
        messages : []
    })
    const new_group = await group.save()
    res.send(new_group);
})

app.put("/update-members",auth,async(req,res) => {
    const {members , group_id } = req.body
    console.log(req.body)
    const creator = req.user
    const updated_group = await Group.findByIdAndUpdate(group_id,
        { $addToSet: { members: {$each : [...members,creator.id] } }},
       { new : true }
    )
    console.log(req.body,updated_group)
    res.send(updated_group);
})

app.put("/update-name",auth,async(req,res) => {
    const {name , group_id } = req.body
    const updated_group = await Group.findByIdAndUpdate(group_id,
        {name},
       { new : true }
    )
    res.send(updated_group);
})

app.delete("/delete",auth,async(req,res) => {
    const {group} = req.body
    const deleted_group = await Group.findByIdAndDelete(group)
    console.log(deleted_group)
    deleted_group.messages.map(async (id) => {
        console.log(id.valueOf())
        Messages.findByIdAndDelete(id.valueOf())
    })
    res.send("Group Deleted")
})

module.exports = app