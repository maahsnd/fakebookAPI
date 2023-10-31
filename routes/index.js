const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get(
  '/',
  passport.authenticate('facebook', {
    failureRedirect: '/login',
    failureMessage: true
  }),
  function (req, res) {
    res.redirect('/');
  }
);

router.get('/login/facebook', passport.authenticate('facebook'));

module.exports = router;
