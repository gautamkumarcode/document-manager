const User = require('../models/User');
const Document = require('../models/Document');
const Category = require('../models/Category');

// @desc    Get dashboard statistics
// @route   GET /api/stats
// @access  Private/Admin
exports.getDashboardStats = async (req, res) => {
  try {
    const [userCount, documentCount, categoryCount] = await Promise.all([
      User.countDocuments(),
      Document.countDocuments(),
      Category.countDocuments(),
    ]);

    // Get recent documents (last 5)
    const recentDocuments = await Document.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('uploadedBy', 'name')
      .populate('category', 'name');

    res.status(200).json({
      success: true,
      data: {
        counts: {
          users: userCount,
          documents: documentCount,
          categories: categoryCount,
          activeSessions: 0, // Placeholder or implement session tracking later
        },
        recentDocuments,
      },
    });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats',
      error: error.message,
    });
  }
};
