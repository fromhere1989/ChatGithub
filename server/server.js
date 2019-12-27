const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')
const cookie = require('cookie')
const User = require('./models/User');
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

io.on('connection', socket => {
  //кусок кода, в котором я привязал сесии к сокетам через куки.
  //что с этим делать - не знаю
  /*  if (socket.handshake.headers.cookie) {
      let cookies = cookie.parse(socket.handshake.headers.cookie);
      let sessionId = cookieParser.signedCookie(cookies['express.sid'], 'Irtish');
      if (cookies['express.sid'] == sessionId) {
        throw new Error({ error: 'invalid sid'})
      };
    } else {
      throw new Error({ error: 'No cookie transmitted.'})
    };*/

    //имя юзера привязывается к url и проверяется на совпадения
    //скорее костыль, чем решение. Ненастоящие юзеры выстегиваются
    //Баг: почему-то сокеты отправляют любое имя перед дисконектом
    let uncheckedName = socket.handshake.headers.referer.slice(27);
    User.findOne({ name: uncheckedName }, (err, user) => {
      if (!user) {
        socket.disconnect()
      };
      let userName = uncheckedName ;
      socket.broadcast.emit('newUser', userName);
      socket.emit('userName', userName);
      socket.on('message', msg => {
        console.log('User: ' + userName + ' | Message: ' + msg);

        io.sockets.emit('messageToClients', msg, userName);
      });
    });
  },
);
