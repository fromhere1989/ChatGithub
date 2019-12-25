const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const initDb = require('./db');
const router = require('./routes/router');

const mongoose = require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('views'));

initDb(app);
app.use('/', router);

const server = app.listen('8080', function() {console.log('On port 8080')});

const io = require('socket.io')(server);

io.on('connection', socket => {
  let user_id = socket.id;
  socket.broadcast.emit('newUser', user_id);
  socket.emit('userName', user_id);
  //console.log(name + ' connected to chat!');

  socket.on('message', msg => {
    console.log('User: ' + name + ' | Message: ' + msg);

    io.sockets.emit('messageToClients', msg, name);
  });
});
