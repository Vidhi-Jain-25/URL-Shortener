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

var api_key = 'b1df829f898334ff43ff5d5812a9e15a-ffefc4e4-b1b88ab7'
const mailgun = require("mailgun-js")
const DOMAIN = 'sandbox5dca1e6a485b4b6f9a8282de540bd818.mailgun.org'
const mg = mailgun({ apiKey: api_key, domain: DOMAIN })

const User = require("../models/User")
const ShortUrl = require('../models/shortUrl')
users.use(cors())

process.env.SECRET_KEY = 'secret'
process.env.CLIENT_URL = 'http://localhost:3001/'

exports.login = (req, res) => {

  User.findOne({
    email: req.body.email
  })
    .then(user => {
      if (user) {
        if (bcrypt.compareSync(req.body.password, user.password)) {
          // Passwords match
          const payload = {
            _id: user._id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email
          }

          let token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: '5m'
          })

          res.send(token);
        } else {
          // Passwords don't match
          res.json({ error: 'Incorrect Password!' })
        }
      }
      else {
        res.json({ error: 'User does not exist!' })
      }
    })
    .catch(err => {
      res.send('Login error: ' + err)
    })
}