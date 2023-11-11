const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.sign_up = [
  body('username')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Username required')
    .custom(async (value) => {
      const username = await User.find({ username: value });
      username ? false : true;
    })
    .escape(),
  body('password')
    .trim()
    .custom((value) => {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+[\]{}|;:'",.<>?/]).{8,}$/;
      if (passwordRegex.test(value)) {
        return true;
      }
      return false;
    })
    .withMessage(
      'Password must be min 8 characters, contain a lower case, upper case, number, and special character.'
    )
    .escape(),
  body('confirm_password')
    .trim()
    .custom((value, { req }) => {
      return req.body.password === value;
    })
    .withMessage('Passwords do not match')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).errors;

    const user = new User({
      username: req.body.username,
      password: req.body.password
    });
    if (errors.length) {
      res.status(401).json({ errors });
      return;
    } else {
      bcrypt.hash(user.password, 10, async (err, hashedPassword) => {
        user.password = hashedPassword;
        await user.save();
      });
    }
    res.status(200).json({ username: user.username });
  })
];

exports.log_in = asyncHandler(async (req, res, next) => {
  const data = await User.find({ username: req.body.username });
  const user = data[0];
  if (!user) {
    return res.status(401).json({ msg: 'Username not found' });
  }
  const match = await bcrypt.compare(req.body.password, user.password);
  if (!match) {
    return res.status(401).json({ msg: 'Incorrect password' });
  }
  const username = user.username;
  const token = jwt.sign({ username }, process.env.SECRET, {
    expiresIn: '2hr'
  });
  console.error('success');
  return res.status(200).json({
    msg: 'Log in successful',
    token,
    userId: user._id
  });
});
