const router = require('express').Router();
const { validateSigin } = require('../utils/validation');

const { login } = require('../controllers/users');

router.post('/signin', validateSigin, login);

module.exports = router;
