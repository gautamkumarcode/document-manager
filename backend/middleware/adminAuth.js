const adminAuth = (req, res, next) => {
  // This middleware should be used AFTER the protect middleware
  // req.user should already be populated by protect middleware
  
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: 'Not authenticated',
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.',
    });
  }

  next();
};

module.exports = { adminAuth };
