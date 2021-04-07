const express = require("express")
const users = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const _ = require("lodash")
require('dotenv').config()
const nodemailer = require('nodemailer');
const mongoose = require('mongoose')
const { result } = require("lodash")

const mailgun = require("mailgun-js")
var api_key = 'b1df829f898334ff43ff5d5812a9e15a-ffefc4e4-b1b88ab7'
const DOMAIN = 'sandbox5dca1e6a485b4b6f9a8282de540bd818.mailgun.org'
const mg = mailgun({ apiKey: api_key, domain: DOMAIN })

const User = require("../models/User")
const ShortUrl = require('../models/shortUrl')


users.use(cors())
const { login } = require("../controllers/login")
const { register } = require("../controllers/register")
const { authenticate } = require("../controllers/authenticate")
const { social_login } = require("../controllers/socialLogin")
const { profile } = require("../controllers/profile")
const { delete_profile } = require("../controllers/delete")
const { forgot_password } = require("../controllers/forgotPassword")
const { reset_password } = require("../controllers/resetPassword")
const { url_history } = require("../controllers/urlHistory")
const { short_url } = require("../controllers/shortenUrl")

process.env.SECRET_KEY = 'secret'
process.env.CLIENT_URL = 'http://localhost:3001/'

users.post('/register', register);   //when creating a new account or registering

users.post('/authenticate', authenticate);   // to authenticate while registration or creating of new account.

users.post('/social_login', social_login);   // when logging in using google account

users.post('/login', login);   // Log In

users.get('/profile', profile);  

users.get('/delete', delete_profile);   //Delete account

users.put('/forgot-password', forgot_password);

users.put('/resetpassword', reset_password);

users.post('/urlhistory', url_history);

users.post('/shortUrls', short_url);

// Called when we the click the shortened url, ie the link we get after shortening
users.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null)
        return res.sendStatus(404)
    res.redirect(shortUrl.full)
}) 


module.exports = users