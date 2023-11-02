exports.checkAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('http://localhost:5173/login');
};