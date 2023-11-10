const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user-controller');
const User = require('../models/User');
const multer = require('multer');
const path = require('path');
const storage = new multer.memoryStorage();
const upload = multer({ storage });

/* GET users listing. */
router.get('/:id/suggested_friends', UserController.get_suggested_friends);

router.get('/:id', UserController.get_user);

router.get('/:id/friends', UserController.get_friends);

router.post('/:id/friendrequests', UserController.create_friend_request);

router.post('/:id/profilepic', upload.any(), UserController.update_pic);

router.post(
  '/:id/friendrequests/:requestid/accept',
  UserController.accept_friend_request
);

router.post(
  '/:id/friendrequests/:requestid/decline',
  UserController.decline_friend_request
);

module.exports = router;
