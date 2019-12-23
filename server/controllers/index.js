const User = require('../models/User');
const path = require('path');


const mongoose = require('mongoose');
const express = require('express');
const app = express();

getLogin = (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/form.html'))
};

getAuth = (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/auth.html'))
};

getIndex = (req, res) => {
  res.render('./index.ejs', { userName: req.session.userName });
};

findUser = (req, res) => {
  User.findOne({ name: req.body.name }, (err, user) => {
    if (err) {
        return res.status(500).json({ success: false, error: err })
    }
    if (!user) {
        return res
            .status(404)
            .json({ success: false, error: `User not found` })
    }
    req.session.userName = user.name;
    return res.status(200).redirect('/index')
}).catch(err => console.log(err))
};

saveUser = (req, res) => {
  const user = new User(req.body)
  if (req.body.password.length < 6) {
    return res.status(400).json({
            success: false,
            error: 'minlength in password - 6 symbols',
        });
  };
  user.save();
  req.session.userName = user.name;
  return res.status(200).redirect('/index')
};

module.exports = {
  getLogin,
  getAuth,
  findUser,
  saveUser,
  getIndex,
};
