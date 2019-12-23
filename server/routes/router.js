const express = require('express');
const Controllers = require('../controllers/index');
const router = express.Router();

router.get('/', Controllers.getLogin);
router.post('/', Controllers.findUser);
router.get('/index', Controllers.getIndex);

module.exports = router;
