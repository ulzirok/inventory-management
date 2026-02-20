module.exports.isAuthenticated = (req, res, next) => {
  if (req.user && !req.user.isBlocked) {
    next();
  } else {
    res.status(403).json({ message: "Account blocked or not authenticated." });
  }
};


module.exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({ message: "Access only for administrators." });
  }
};

