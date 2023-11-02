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
  await User.updateOne({ _id: req.body.author }, { $push: { posts: newPost } });
  res.status(200).json({ post: newPost, user: user });
});

exports.like_post = asyncHandler(async (req, res, next) => {
  const postId = req.params.postid;
  const userId = req.body.userid;
  await Post.updateOne({ _id: postId }, { $push: { likes: userId } });
  res.status(200).send();
});
