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
      console.log('req.user passport--->' + req.user);
      console.log('req.session.passport passport--->' + req.session.passport);
    });
    res.redirect('http://localhost:5173/' + req.user._id);
  }
);

//called by click on fb log in link
router.get('/login/facebook', passport.authenticate('facebook'));

//called after successful log in
router.get('/', function (req, res, next) {
  console.log('req.user ' + req.user);
  res.send('login success');
});

router.post('/logout', function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.status(200).send();
  });
});

module.exports = router;
