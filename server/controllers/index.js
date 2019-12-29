const User = require('../models/User');
const path = require('path');
const Bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');
const express = require('express');
const app = express();

getLogin = (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/form.html'))
};

logout = (req, res) => {
  User.findOne({ name: req.session.userName }, (err, user) => {
    if (err) {
        return res.status(500).json({ success: false, error: err })
    }
    if (!user) {
        return res
            .status(404)
            .json({ success: false, error: `User not found` })
    }
    const token = req.session.token;
    requiredToken = user.tokens.filter(( token ) => {
      return token.token != (req.session.token).toString();
    });
      user.tokens = requiredToken;
      user.save();
      res.redirect('/');
  });
};

logout = (req, res) => {
  User.findOne({ name: req.session.userName }, (err, user) => {
    if (err) {
        return res.status(500).json({ success: false, error: err })
    }
    if (!user) {
        return res
            .status(404)
            .json({ success: false, error: `User not found` })
    }
    const token = req.session.token;
    requiredToken = user.tokens.filter(( token ) => {
      return token.token != (req.session.token).toString();
    });
      user.tokens = requiredToken;
      user.save();
      res.redirect('/');
  });
};

logoutAll = (req, res) => {
  User.findOne({ name: req.session.userName }, (err, user) => {
    if (err) {
        return res.status(500).json({ success: false, error: err })
    }
    if (!user) {
        return res
            .status(404)
            .json({ success: false, error: `User not found` })
    };
      user.tokens.splice(0, user.tokens.length);
      user.save();
      res.redirect('/');
  });
};

getAuth = (req, res) => {
  res.sendFile(path.join(__dirname, '../../views/auth.html'))
};

getIndex = (req, res) => {
  res.render('./index.ejs', { userName: req.session.userName });
};

getChat = (req, res) => {
    res.cookie('query', req.session.token );
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
    const token = jwt.sign({_id: user._id}, 'Irtish');
    user.tokens = user.tokens.concat({ token});
    req.session.userName = user.name;
    req.session.token = token;
    user.save();
    return res.status(200).redirect(`/chat/`);
}).catch(err => console.log(err));
};

saveUser = (req, res) => {
  if (req.body.password.length < 6) {
    return res.status(400).json({
            success: false,
            error: 'minlength in password - 6 symbols',
        });
  }
  if (!validator.isEmail(req.body.email)) {
    return res.status(400).json({
            success: false,
            error: 'Invalid email adress',
        });
  };
  req.body.password = Bcrypt.hashSync(req.body.password, 10);
  const user = new User(req.body);
  const token = jwt.sign({_id: user._id}, 'Irtish');
  user.tokens = user.tokens.concat({ token});
  user.save();
  req.session.userName = user.name;
  req.session.token = token;
  return res.status(200).redirect(`/chat`)
};

module.exports = {
  getLogin,
  logout,
  logoutAll,
  getAuth,
  getChat,
  findUser,
  saveUser,
  getIndex,
};
