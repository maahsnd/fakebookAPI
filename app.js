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
const postsRouter = require('./routes/posts');

const app = express();

// Session middleware
app.use(
  session({
    secret: process.env.SECRET_KEY,
    saveUninitialized: true,
    resave: true,
    cookie: {
      secure: true,
      sameSite: 'none'
    }
  })
);

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true
  })
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Passport Configuration
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: 'https://localhost:3000/auth/facebook/callback/',
      profileFields: ['displayName']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const user = await User.findOne({ username: profile.displayName });
        if (user) {
          return done(null, user);
        }
        if (!user) {
          const newUser = new User({
            username: profile.displayName,
            friends: [],
            posts: [],
            friendRequests: []
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

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/posts', postsRouter);

passport.serializeUser((user, done) => {
  console.log('SERIALIZE, PARAM---->' + user);
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  console.log('DESERIALIZE, PARAM---->' + id);
  try {
    const user = await User.findById(id).exec();
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Error handling middleware
app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  console.error('err:' + err);
});

module.exports = app;
