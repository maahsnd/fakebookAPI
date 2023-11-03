const express = require('express');
const router = express.Router();
const passport = require('passport');

// called by fb after login
router.get(
  '/auth/facebook/callback/',
  passport.authenticate('facebook', {
    failureRedirect: 'http://localhost:5173/login',
    failureMessage: true
  }),
  function (req, res) {
    req.login(req.user, function (err) {
      if (err) {
        return next(err);
      }
    });
    res.redirect('http://localhost:5173/' + req.user._id);
  }
);

//called by click on log in link
router.get('/login/facebook', passport.authenticate('facebook'));

//called after successful log in
router.get('/', function (req, res, next) {
  console.log('req.user ' + req.user);
  res.send('login success');
});

router.get('/fail', function (req, res, next) {
  res.send('login fail');
});

module.exports = router;
