const express = require('express')
const Server = require('socket.io')
const jwtCheck = require('helper/jwtChecl.js')

const Group = require('/db/group.js')

const app = express()
const io = new Server(3000)

