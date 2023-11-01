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
    res.redirect('http://localhost:5173/');
  }
);

router.get('/login/facebook', passport.authenticate('facebook'));

router.get('/', function (req, res, next) {
  console.log('req.user ' + req.user);
  res.send('login success');
});

router.get('/fail', function (req, res, next) {
  res.send('login fail');
});

module.exports = router;
