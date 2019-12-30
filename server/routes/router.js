const express = require('express');
const Controllers = require('../controllers/index');
const router = express.Router();

router.get('/', Controllers.getLogin);
router.get('/auth', Controllers.getAuth);
router.get('/chat', Controllers.getChat);
router.post('/', Controllers.login);
router.post('/auth', Controllers.saveUser);
router.post('/logout', Controllers.logout);
router.post('/logoutAll', Controllers.logoutAll);

module.exports = router;
