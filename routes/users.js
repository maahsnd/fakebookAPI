const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user-controller');

/* GET users listing. */
router.get('/:id', UserController.get_user);

router.get('/:id/friends', UserController.get_friends);

router.post('/:id/friendrequests', UserController.create_friend_request);

router.post(
  '/:id/friendrequests/:requestid/accept',
  UserController.accept_friend_request
);

router.post(
  '/:id/friendrequests/:requestid/decline',
  UserController.decline_friend_request
);

module.exports = router;
