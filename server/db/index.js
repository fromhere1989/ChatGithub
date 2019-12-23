const mongoose = require('mongoose');
const express = require('express');
const app = express();

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


module.exports = db;
