var express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
var app = express()
require('dotenv').config()
var mongoose = require("mongoose")
var Users = require('./routes/Users')
var port = process.env.PORT || 3003

app.use(bodyParser.json())
app.use(cors())
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)

const mongoURI = ''

mongoose
    .connect(mongoURI, {useNewUrlParser: true})
    .then(() => console.log("MongoDB Connected"))
    .catch(err => console.log("MongoDB Connection Error: "+err))

app.use('/users', Users)

app.listen(port, () => {
    console.log("Server is Running on Port: " + port)
})
