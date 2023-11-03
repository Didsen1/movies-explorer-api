const router = require('express').Router();
const { validateUserUpdate } = require('../utils/validation');
const {
  setUser,
  getCurrentUser,
} = require('../controllers/users');

router.get('/me', getCurrentUser);

router.patch('/me', validateUserUpdate, setUser);

module.exports = router;
