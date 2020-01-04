const User = require('../models/User');
const path = require('path');
const Bcrypt = require('bcryptjs');
const validator = require('validator');
const jwt = require('jsonwebtoken');

const logError = err => console.log(err);

getLogin = (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/form.html'))
};

logout = (req, res) => {
    User.findOne({name: req.session.userName}, (err, user) => {
        if (err) {
            return res.status(500).json({success: false, error: err})
        }
        if (!user) {
            return res
                .status(404)
                .json({success: false, error: `User not found`})
        }
        const validTokens = user.tokens.filter((token) => {
            return token.token !== (req.session.token).toString();
        });
        delete req.session.token;
        user.update({tokens: validTokens})
            .then(() => res.redirect('/'))
            .catch(logError);
    });
};

logoutAll = (req, res) => {
    User.findOne({name: req.session.userName}, (err, user) => {
        if (err) {
            return res.status(500).json({success: false, error: err})
        }
        if (!user) {
            return res
                .status(404)
                .json({success: false, error: `User not found`})
        }
        delete req.session.token;
        user.update({tokens: []})
            .then(() => res.redirect('/'))
            .catch(logError);
    });
};

getAuth = (req, res) => {
    res.sendFile(path.join(__dirname, '../../views/auth.html'))
};

getChat = (req, res) => {
    console.log('2 ' + req.session.userName);
    res.cookie('query', req.session.token);
    res.render('./chat.ejs', {userName: req.session.userName});
};

login = (req, res) => {
    User.findOne({name: req.body.name}, (err, user) => {
        if (err) {
            return res.status(500).json({success: false, error: err})
        }
        if (!user) {
            return res
                .status(404)
                .json({success: false, error: `User not found`})
        }
        let password = req.body.password;

        Bcrypt.compare(password, user.password).then(isPasswordMatch => {
            if (!isPasswordMatch) {
                return res
                    .status(401)
                    .json({success: false, error: `invalid password`})
            }
            const token = jwt.sign({_id: user._id, userName: user.name}, 'Irtish');

            let tokens = user.tokens;
            if (!user.tokens) {
                tokens = [{token}];
            } else {
                tokens.push({token});
            }

            req.session.userName = user.name;
            req.session.token = token;

            user.update({tokens})
                .then(() => res.status(200).redirect(`/chat`))
                .catch(logError);
        }).catch(logError);

    }).catch(logError);
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
    }
    req.body.password = Bcrypt.hashSync(req.body.password, 10);
    const user = new User(req.body);
    const token = jwt.sign({_id: user._id, userName: user.name}, 'Irtish');
    user.tokens = user.tokens.concat({token});
    req.session.userName = user.name;
    req.session.token = token;
    console.log('1 ' + req.session.userName);
    user.save();
    return res.status(200).redirect(`/chat`);
};

module.exports = {
    getLogin,
    logout,
    logoutAll,
    getAuth,
    getChat,
    login,
    saveUser
};
