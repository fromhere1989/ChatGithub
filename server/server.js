const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cookie = require('cookie')
const User = require('./models/User');
const jwt = require('jsonwebtoken');
const axios = require('axios');

const initDb = require('./db');
const router = require('./routes/router');

const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('views'));

initDb(app);
app.use('/', router);

const server = app.listen('8080', function() {console.log('On port 8080')});

const io = require('socket.io')(server);

io.use(function(socket, next){
  if (socket.handshake.query && socket.handshake.query.token){
    jwt.verify(socket.handshake.query.token, 'Irtish', function(err, decoded) {
    if(err) return next(new Error('Authentication error'));
    socket.decoded = decoded;
      next();
    });
  } else {
      next(new Error('Authentication error'));
  }
})
  .on('connection', socket => {
    User.findOne({ _id: socket.decoded }, (err, user) => {
      if (!user) {
        socket.disconnect()
      };
      let userName = user.name;
      socket.broadcast.emit('newUser', userName);
      socket.emit('userName', userName);
      socket.on('message', msg => {
        console.log('User: ' + userName + ' | Message: ' + msg);
        io.sockets.emit('messageToClients', msg, userName);
      });
      socket.on('logout', function(){
        if(!user.tokens.token) {
          socket.disconnect();
          console.log('disc');
        } else {
          console.log('dont disc')
        }
       })
      });
    },
  );
