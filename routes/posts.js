const express = require('express');
const router = express.Router();
const passport = require('passport');
const postController = require('../controllers/post-controller');
const authHelper = require('../authHelper');

/* Create post */
router.post('/', postController.create_post);

module.exports = router;
