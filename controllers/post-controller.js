const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Post = require('../models/Post');

exports.create_post = asyncHandler(async (req, res, next) => {
  console.log('req.user---->' + req.user);
  //user._id
  const author = req.body.author;
  const newPost = new Post({
    author: author,
    text: req.body.text,
    comments: [],
    likes: []
  });
  await newPost.save();
  const user = await User.updateOne(
    { _id: req.body.author },
    { $push: { posts: newPost } }
  );
  res.status(200).json({ post: newPost, user: user });
});
