const User = require('../models/User');
const path = require('path');
const Bcrypt = require('bcryptjs');

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

getChat = (req, res) => {
    res.render('./chat.ejs', { userName: req.session.userName });
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
    let password = req.body.password;
    const isPasswordMatch = Bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res
          .status(401)
          .json({ success: false, error: `invalid password` })
    }
    req.session.userName = user.name;
    return res.status(200).redirect('/chat')
}).catch(err => console.log(err))
};

saveUser = (req, res) => {
  req.body.password = Bcrypt.hashSync(req.body.password, 10);
  const user = new User(req.body)
  if (req.body.password.length < 6) {
    return res.status(400).json({
            success: false,
            error: 'minlength in password - 6 symbols',
        });
  };
  user.save();
  req.session.userName = user.name;
  return res.status(200).redirect('/chat')
};

module.exports = {
  getLogin,
  getAuth,
  getChat,
  findUser,
  saveUser,
  getIndex,
};
