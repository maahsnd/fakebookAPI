const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user-controller');
const authHelper = require('../authHelper');

/* GET users listing. */
router.get('/:id', authHelper.checkAuth, UserController.get_user);

router.post(
  '/:id/friendrequests',
  authHelper.checkAuth,
  UserController.create_friend_request
);

router.post(
  '/:id/friendrequests/:requestid/accept',
  authHelper.checkAuth,
  UserController.accept_friend_request
);

router.post(
  '/:id/friendrequests/:requestid/decline',
  authHelper.checkAuth,
  UserController.decline_friend_request
);

module.exports = router;
