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

process.env.SECRET_KEY = 'secret'

exports.authenticate = (req, res) => {
  if (req.body.token) {
    jwt.verify(req.body.token, process.env.SECRET_KEY, function (error, decodedData) {
      if (error) {
        return res.status(401).json({ error: "Incorrect or Expired Link" })
      }
      const { first_name, last_name, email, password, date } = decodedData._doc;
      const temp_email = email
      User.findOne({
        email: temp_email
      })
        .then(user => {
          if (!user) {
            const userData = {
              first_name: first_name,
              last_name: last_name,
              email: email,
              password: password,
              date: date
            }
            bcrypt.hash(password, 10, (err, hashedPassword) => {
              userData.password = hashedPassword
              User.create(userData)
                .then(user => {
                  res.json({ status: user.email + ' successfully registered!' })
                })
                .catch(err => {
                  res.send('error: ' + err)
                })
            })

          }
          else {
            res.status(400).json({ error: "User Already Exist!" })
          }
        })
        .catch(err => {
          res.send('Error: ' + err)
        })
    })

  }
  else {
    return res.status(401).json({ error: "Authentication Error" })
  }
}