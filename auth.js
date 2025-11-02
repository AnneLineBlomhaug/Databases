const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next(); // User is admin, proceed
  }
  res.status(403).send('Unauthorized'); // User is not admin
};

const isAuthenticated = (req, res, next) => {
  if (req.user) {
    return next(); // User is logged in, proceed
  }
  res.redirect('/login'); // Redirect to login page if user is not logged in
};

module.exports = { isAdmin, isAuthenticated };
