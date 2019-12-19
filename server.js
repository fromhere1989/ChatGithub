const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo')(session);

mongoose.connect('mongodb://someuser:pst101@ds145921.mlab.com:45921/fromherecrudtest',
 {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use(
  session({
    secret: 'you secret key',
    saveUninitialized: true,
    store: new MongoStore({mongooseConnection: mongoose.connection})
  })
);


app.get('/', (req, res) => {
  req.session.trueName = 'Valera';
  res.sendFile(path.join(__dirname, './form.html'))
  }
);

app.post('/', (req, res) => {
  if (req.body.name !== req.session.trueName) {
    res.sendFile(path.join(__dirname, './form2.html'));
  } else {
      res.locals.userName = req.body.name;
      res.render('index.ejs');
  }
});

app.get('/index', (req, res) => {
  res.send('Приветсвую вас, ' + req.session.name)
});

app.listen('8080', function() {
  console.log('On port 8080')
});
