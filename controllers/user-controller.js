const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const uploadImage = require("../uploadImage")

require('dotenv').config();
const { body, validationResult } = require('express-validator');



async function handleUpload(file) {
  const res = await cloudinary.uploader.upload(file, {
    resource_type: 'auto',
    folder: 'fakebook'
  });
  return res;
}

exports.get_user = asyncHandler(async (req, res, next) => {
  const data = await User.findOne({ _id: req.params.id })
    .populate('friendRequests')
    .populate('friends')
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
    const data = await User.findById(userid).exec();
    let exclude = data.friendRequests
   exclude.push(data._id);
    const users = await User.find({
      $and: [
        { friends: { $nin: [userid] } }, // Exclude users where userid is in their friends
         { _id: { $nin: exclude } },  // Exclude users where ID matches userid,users who have already requested current user
        { friendRequests: { $nin: [userid] } }, //Exclude users who current user has already requested
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
  await User.findByIdAndUpdate(to, { $addToSet: { friendRequests: from } });
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

exports.update_pic = asyncHandler(async (req, res, next) => {
  try {
   const response = await uploadImage(req.body.image);
    await User.findOneAndUpdate({_id: req.params.id}, {$set: {profilePhoto: response}})
   res.status(200).send()
  } catch (error) {
    console.log(error);
    res.status(500).json(response.message)
    return;
  }

  res.status(200).send();
});

exports.update_bio = [
  body('text')
    .trim()
    .isLength({ max: 400 })
    .withMessage('Bio cannot exceeed 400 char'),

  asyncHandler(async (req, res, next) => {
    try {
      const errors = validationResult(req).errors;
      if (errors.length) {
        console.error('err--->' + errors);
        return res.status(401).json(errors);
      }
      await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: { bio: req.body.text }
        },
        { upsert: true }
      ).exec();
      res.status(200).send();
    } catch (err) {
      console.error(err);
      res.status(500).send();
    }
  })
];
