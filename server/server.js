const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const router = require('./routes/router');


const mongoose = require('mongoose');

mongoose
    .connect('mongodb://someuser:pst101@ds145921.mlab.com:45921/fromherecrudtest',
 {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
})
    .catch(e => {
      console.error('Connection error', e.message)
    });

const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const db = mongoose.connection;
app.use(
  session({
    secret: 'you secret key',
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
  })
);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '../views'));

app.use('/', router);

app.listen('8080', function() {
  console.log('On port 8080')
});
