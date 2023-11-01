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

exports.accept_friend_request = asyncHandler(async (req, res, next) => {
  const requestId = req.body.id;
  const friendRequest = await FriendRequest.findByIdAndDelete(requestId);
  const [to, from] = await Promise.all([
    User.findOne({ _id: friendRequest.to })
      .populate('friendRequests')
      .populate('friends').exec,
    User.findOne({ _id: friendRequest.from })
      .populate('friendRequests')
      .populate('friends').exec
  ]);
  to.friends.push(from);
  to.friendRequests = to.friendRequests.filter(
    (request) => request.from !== from
  );
  from.friends.push(to);
  from.friendRequests = from.friendRequests.filter(
    (request) => request.from !== to
  );
  await to.save();
  await from.save();
});

exports.decline_friend_request = asyncHandler(async (req, res, next) => {
  const requestId = req.body.id;
  const friendRequest = await FriendRequest.findByIdAndDelete(requestId);
  const [to, from] = await Promise.all([
    User.findOne({ _id: friendRequest.to })
      .populate('friendRequests')
      .populate('friends').exec,
    User.findOne({ _id: friendRequest.from })
      .populate('friendRequests')
      .populate('friends').exec
  ]);
  to.friendRequests = to.friendRequests.filter(
    (request) => request.from !== from
  );
  from.friendRequests = from.friendRequests.filter(
    (request) => request.from !== to
  );
  await to.save();
  await from.save();
});
