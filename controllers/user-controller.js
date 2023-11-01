const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');

exports.get_user = asyncHandler(async (req, res, next) => {
  const data = await User.findOne({ _id: req.params.id });
  res.status(200).json(data);
});

exports.create_friend_request = asyncHandler(async (req, res, next) => {
  const from = req.params.id;
  const to = req.body.to;
  const friendRequest = new FriendRequest({
    from,
    to
  });
  await friendRequest.save();
  res.status(200).json({ to: to, from: from });
});

exports.accept_friend_request = asyncHandler(async (req, res, next) => {
  const requestId = req.params.requestid;
  const friendRequest = await FriendRequest.findByIdAndDelete(requestId);
  const [to, from] = await Promise.all([
    User.findOne({ _id: friendRequest.to })
      .populate('friendRequests')
      .populate('friends')
      .exec(),
    User.findOne({ _id: friendRequest.from })
      .populate('friendRequests')
      .populate('friends')
      .exec()
  ]);
  to.friends.push(from._id);
  to.friendRequests = to.friendRequests.filter(
    (request) => request.from !== from
  );
  from.friends.push(to._id);
  from.friendRequests = from.friendRequests.filter(
    (request) => request.from !== to
  );
  await to.save();
  await from.save();
  res.status(200).json({ to: to, from: from });
});

exports.decline_friend_request = asyncHandler(async (req, res, next) => {
  const requestId = req.params.requestid;
  const friendRequest = await FriendRequest.findByIdAndDelete(requestId);
  const [to, from] = await Promise.all([
    User.findOne({ _id: friendRequest.to })
      .populate('friendRequests')
      .populate('friends')
      .exec(),
    User.findOne({ _id: friendRequest.from })
      .populate('friendRequests')
      .populate('friends')
      .exec()
  ]);
  to.friendRequests = to.friendRequests.filter(
    (request) => request.from !== from
  );
  from.friendRequests = from.friendRequests.filter(
    (request) => request.from !== to
  );
  await to.save();
  await from.save();
  res.status(200).json({ to: to, from: from, friendRequest: friendRequest });
});
