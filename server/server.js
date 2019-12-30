const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const initDb = require('./db');
const router = require('./routes/router');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static('views'));

initDb(app);
app.use('/', router);

const server = app.listen('8080', function () {
    console.log('On port 8080')
});

const io = require('socket.io')(server);

const authMiddleware = function (socket, next) {
    const hasToken = socket.handshake.query && socket.handshake.query.token;
    if (!hasToken) {
        next(new Error('Authentication error'));
    }
    const {id, userName} = jwt.verify(socket.handshake.query.token, 'Irtish');
    socket.userId = id;
    socket.userName = userName;
    next();
};

const sendInitMessages = async socket => {
    return authMiddleware(socket, () => {
        console.log("connection");
        socket.broadcast.emit('newUser', socket.userName);
        socket.emit('userName', socket.userName);
    });
};

io.on('connection', socket => {
        try {
            sendInitMessages(socket).catch(e => {
                console.log(e);
                socket.disconnect();
            });
            socket.use((_, next) => authMiddleware(socket, next));
            socket.on('message', msg => {
                console.log('User: ' + socket.userName + ' | Message: ' + msg);
                io.sockets.emit('messageToClients', msg, socket.userName);
            });
            socket.on('logout', async function () {
                socket.disconnect();
                console.log('disc');
            });
        } catch (e) {
            console.log(e);
            socket.disconnect();
        }
    },
);
