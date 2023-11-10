const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  profilePhoto: { type: String },
  bio: { type: String, maxLength: 400 }
});

module.exports = mongoose.model('User', UserSchema);
