const express = require('express');
const router = express.Router();
const { getDashboardStats } = require('../controllers/statsController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

router.get('/', protect, adminAuth, getDashboardStats);

module.exports = router;
