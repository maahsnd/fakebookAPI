const FacebookStrategy = require('passport-facebook');
const User = require('./models/User');
require('dotenv').config();

exports.strategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: 'http://localhost:5173/'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const user = await User.find({ fb_id: profile.id });
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
      }
    } catch (err) {
      return done(err);
    }
  }
);
