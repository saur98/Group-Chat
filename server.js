const express = require('express')
const connectDB = require('./db/connect.js')
const app = express()

connectDB()
app.use(express.json())
app.use(require('./routes/admin/create-user'))
app.use(require('./routes/user/login-logout'))
app.use("/group",require('./routes/group/create'))
app.use(require('./routes/group-chat/messages'))
app.use(require('./routes/reset/reset'))

app.listen(3000,() => {
    console.log('connected to port 3000')
})