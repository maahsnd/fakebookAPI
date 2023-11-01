const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user-controller');

/* GET users listing. */
router.get('/:id', UserController.get_user);

module.exports = router;
