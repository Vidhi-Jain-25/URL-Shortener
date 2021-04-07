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
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

var api_key = 'b1df829f898334ff43ff5d5812a9e15a-ffefc4e4-b1b88ab7'
const mailgun = require("mailgun-js")
const DOMAIN = 'sandbox5dca1e6a485b4b6f9a8282de540bd818.mailgun.org'
const mg = mailgun({ apiKey: api_key, domain: DOMAIN })

const User = require("../models/User")
const ShortUrl = require('../models/shortUrl')
users.use(cors())

process.env.SECRET_KEY = 'secret'
process.env.CLIENT_URL = 'http://localhost:3000'

const client = 'http://localhost:3000'

exports.register = (req, res) => {
    const payload = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        date: new Date()
    });
    User.findOne({
        email: req.body.email
    })
        .then(user => {
            if (!user) {
                bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
                    payload.password = hashedPassword

                });
                const token = jwt.sign(payload, process.env.SECRET_KEY, {
                    expiresIn: '30m'
                });
                const resetUrl = process.env.CLIENT_URL + "users/authenticate/" + token;
                payload.resetLink = resetUrl;


                let mailTransporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'forsites25@gmail.com',
                        pass: 'Q123456789)'
                    }
                });
                const data = {
                    from: 'forsites25@gmail.com',
                    to: payload.email,
                    subject: 'Authenticate Your Account',
                    html: `
                                <h3> Click here to Authenticate Your Account</h3>
                                <link><p>${client}/users/authenticate/${token}</p></link>
                            `
                };
                mailTransporter.sendMail(data, function (error, data) {
                    if (error) {
                        return res.json({ error: error.message })
                    }
                    else
                        return res.status(200).json({ error: "Authentication mail has been sent successfully!" })
                })

            }
            else {
                res.json({ error: 'User already exists!' })
            }
        })
        .catch(err => {
            res.send('Registration Error: ' + err)
        })
}




























