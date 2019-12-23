const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');

const router = require('./routes/router');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '../views'));

app.use('/', router);

app.listen('8080', function() {
  console.log('On port 8080')
});
