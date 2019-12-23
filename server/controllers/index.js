const User = require('../models/User');
const path = require('path');


const mongoose = require('mongoose');
const express = require('express');
const app = express();

getLogin = (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/form.html'))
};

findUser = (req, res) => {
  User.findOne({ name: req.body.name }, (err, user) => {
    if (err) {
        return res.status(400).json({ success: false, error: err })
    }
    if (!user) {
        return res
            .status(404)
            .json({ success: false, error: `User not found` })
    }
    return res.status(200).json(user)
}).catch(err => console.log(err))
};


getIndex = (req, res) => {
  res.send('ok!');
};

module.exports = {
  getLogin,
  findUser,
  getIndex,
};
