const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const initDb = function (app) {
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

    app.use(
        session({
            secret: 'you secret key',
            resave: true,
            saveUninitialized: true,
            store: new MongoStore({mongooseConnection: mongoose.connection})
        })
    );
};

module.exports = initDb;
