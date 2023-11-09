const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { request } = require('https');
const { ObjectId } = require('mongodb');

exports.get_user = asyncHandler(async (req, res, next) => {
  const data = await User.findOne({ _id: req.params.id })
    .populate('friendRequests')
    .exec();
  res.status(200).json(data);
});

exports.get_friends = asyncHandler(async (req, res, next) => {
  const userid = req.params.id;
  try {
    const friends = await User.find({ friends: { $in: [userid] } })
      .sort('username')
      .exec();
    res.status(200).json(friends);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

exports.get_suggested_friends = asyncHandler(async (req, res, next) => {
  const userid = req.params.id;
  try {
    const data = await User.findById(userid, {
      _id: 0,
      friendRequests: 1
    }).exec();
    const friendRequests = data.friendRequests;
    const users = await User.find({
      $and: [
        { friends: { $nin: [userid] } }, // Exclude users where userid is in their friends
        { _id: { $ne: userid } }, // Exclude users where ID matches userid,
        { friendRequests: { $nin: [userid] } }, //Exclude users who current user has already requested
        { _id: { $nin: friendRequests } } //Exclude users who have already requested current user
      ]
    })
      .sort('username')
      .exec();
    res.status(200).json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

exports.create_friend_request = asyncHandler(async (req, res, next) => {
  const from = req.params.id;
  const to = req.body.to;
  await User.findByIdAndUpdate(to, { $push: { friendRequests: from } });
  res.status(200).json({ to: to, from: from });
});

exports.accept_friend_request = asyncHandler(async (req, res, next) => {
  const requestId = req.params.requestid;
  const userId = req.params.id;
  try {
    await Promise.all([
      User.findOneAndUpdate(
        { _id: userId },
        { $push: { friends: requestId }, $pull: { friendRequests: requestId } }
      ).exec(),
      User.findOneAndUpdate({ _id: requestId }, { $push: { friends: userId } })
    ]);
  } catch (err) {
    console.error(err);
    res.status(500).send();
    return;
  }
  res.status(200).send();
});

exports.decline_friend_request = asyncHandler(async (req, res, next) => {
  const requestId = req.params.requestid;
  const userId = req.params.id;
  try {
    await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { friendRequests: requestId } }
    );
  } catch (error) {
    console.error(error);
    res.status(500).send();
  }
  res.status(200).send();
});
