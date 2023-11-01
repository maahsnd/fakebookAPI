const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  username: { type: String, required: true },
  friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  friendRequests: [{ type: Schema.Types.ObjectId, ref: 'FriendRequest' }]
});

module.exports = mongoose.model('User', UserSchema);
