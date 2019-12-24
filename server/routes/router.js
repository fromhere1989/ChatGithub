const express = require('express');
const Controllers = require('../controllers/index');
const router = express.Router();

router.get('/', Controllers.getLogin);
router.get('/auth', Controllers.getAuth)
router.get('/chat', Controllers.getChat);
router.post('/', Controllers.findUser);
router.post('/auth', Controllers.saveUser);

module.exports = router;
