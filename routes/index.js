const express = require('express');
const router = express.Router();
const passport = require('passport');

/* GET home page. */
router.get(
  '/auth/facebook/callback/',
  passport.authenticate('facebook', {
    failureRedirect: '/fail',
    failureMessage: true
  }),

  function (req, res) {
    res.send('success');
  }
);

router.get('/login/facebook', passport.authenticate('facebook'));

router.get('/login', function (req, res, next) {
  res.send('login route');
});

module.exports = router;
