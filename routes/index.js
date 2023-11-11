const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');

router.post('/login', authController.log_in);

router.post('/signup', authController.sign_up);

module.exports = router;
