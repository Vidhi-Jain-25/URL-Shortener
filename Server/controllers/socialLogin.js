const express = require("express")
const users = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const _ = require("lodash")
require('dotenv').config()
const nodemailer = require('nodemailer');
const { result } = require("lodash")
const mongoose = require('mongoose')

var api_key = 'b1df829f898334ff43ff5d5812a9e15a-ffefc4e4-b1b88ab7'
const mailgun = require("mailgun-js")
const DOMAIN = 'sandbox5dca1e6a485b4b6f9a8282de540bd818.mailgun.org'
const mg = mailgun({apiKey: api_key, domain: DOMAIN})

const User = require("../models/User")
const ShortUrl = require('../models/shortUrl')
users.use(cors())

process.env.SECRET_KEY = 'secret'
process.env.CLIENT_URL = 'http://localhost:3001/'

exports.social_login = (req, res) => {
    const userData = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        date: new Date()
    }

    User.findOne({
        email: req.body.email
    })
    .then(user => {
        if(!user)
        {
            bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                userData.password = hashedPassword
                User.create(userData)
                .then(user => {
                    
                    res.json({status: user.email + 'Registered!'})
                })
                .catch(err => {
                    res.send('Social Login Error: ' + err)
                })
            })
        }
        else{
            res.json({error: 'User already exists!'})
        }
    })
    .catch(err => {
        res.send('Login Error: ' + err)
    })
}