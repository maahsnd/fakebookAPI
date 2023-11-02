const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const Post = require('../models/Post');
const Comment = require('../models/Comment');
const { body, validationResult } = require('express-validator');

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

exports.create_comment = [
  body('text')
    .trim()
    .isLength({ min: 1 })
    .withMessage('Comment cannot be blank')
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req).errors;

    if (errors.length) {
      console.error('err--->' + errors);
      res.status(401).json(errors);
      return;
    }

    const userId = req.body.userid;
    const postId = req.params.postid;
    const comment = new Comment({
      author: userId,
      text: req.body.text,
      post: postId
    });
    await comment.save();
    await Post.updateOne({ _id: postId }, { $push: { comments: comment } });
    res.status(200).json({ comment: comment });
  })
];
