const asyncHandler = require('express-async-handler');
const User = require('../models/User');

exports.get_user = asyncHandler(async (req, res, next) => {
  const data = await User.findOne({ _id: req.params.id });
  res.status(200).json(data);
});
