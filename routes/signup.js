const router = require('express').Router();
const { validateSigup } = require('../utils/validation');

const { createUser } = require('../controllers/users');

router.post('/signup', validateSigup, createUser);

module.exports = router;
