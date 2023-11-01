const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook');
const User = require('./models/User');
const cors = require('cors');
require('dotenv').config();
require('./mongoConfig');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

// Session middleware
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: true,
    saveUninitialized: true
  })
);

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Passport Configuration
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'https://localhost:3000/auth/facebook/callback/' // Make sure this matches your Facebook App configuration
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ username: profile.displayName });
        console.log('user:' + user);
        if (user) {
          return done(null, user);
        }
        if (!user) {
          const newUser = new User({
            username: profile.displayName,
            friends: [],
            posts: []
          });
          await newUser.save();
          return done(null, newUser);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Define your routes
app.use('/', indexRouter);
app.use('/users', usersRouter);

// Error handling middleware
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  console.error('err:' + err);
});

module.exports = app;
