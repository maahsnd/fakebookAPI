const express = require('express');
const router = express.Router();
const passport = require('passport');
const postController = require('../controllers/post-controller');
const JWT = require('../verifyJWT');
router.use(JWT.verify);

/* Create post */
router.post('/', postController.create_post);

router.get('/:userid', postController.get_all_user_posts);

router.get('/:userid/all', postController.get_all_posts);

router.get('/:postid', postController.get_post);

router.post('/:postid/likes', postController.like_post);

router.post('/:postid/comments', postController.create_comment);

module.exports = router;
