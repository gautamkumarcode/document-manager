const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Check if token exists
  if (!token) {
		console.log("No token found. Headers:", req.headers.authorization);
		return res.status(401).json({
			success: false,
			message: "Not authorized to access this route. Please login.",
		});
	}

	try {
		// Verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

		// Get user from token (exclude password)
		req.user = await User.findById(decoded.id).select("-password");

		if (!req.user) {
			console.log("User not found for token:", decoded.id);
			return res.status(401).json({
				success: false,
				message: "User not found",
			});
		}

		next();
	} catch (error) {
		console.error("Auth error:", error.message);
		return res.status(401).json({
			success: false,
			message: "Not authorized, token failed",
			error: error.message,
		});
	}
};

module.exports = { protect };
