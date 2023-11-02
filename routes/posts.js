const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET all posts */
router.get('/', res.send('all posts'));

module.exports = router;
