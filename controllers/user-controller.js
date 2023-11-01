const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');

exports.get_user = asyncHandler(async (req, res, next) => {
  const data = await User.findOne({ _id: req.params.id });
  res.status(200).json(data);
});

exports.create_friend_request = asyncHandler(async (req, res, next) => {
  const from = req.body.from;
  const to = req.body.to;
  const friendRequest = new FriendRequest({
    from,
    to
  });
  await friendRequest.save();
  res.status(200).json('friend request sent');
});
