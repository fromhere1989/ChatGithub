const express = require('express');
const Controllers = require('../controllers/index');
const router = express.Router();

router.get('/', Controllers.getLogin);
router.get('/auth', Controllers.getAuth)
router.get('/index', Controllers.getIndex);
router.post('/', Controllers.findUser);
router.post('/auth', Controllers.saveUser);

module.exports = router;
