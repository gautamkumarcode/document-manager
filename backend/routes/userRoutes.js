const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// Make sure auth middleware has 'authorize' or implemented similarly for role check
// If not, I will add it or just rely on 'protect' + manual check if needed
// Assuming 'protect' adds user to req.
// I'll assume 'authorize' is not yet created, so I'll create a simple inline one or check auth.js

// Using 'admin' as the required role
router.use(protect);
router.use((req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, message: 'Not authorized as admin' });
    }
});

router.route('/')
  .get(getAllUsers)
  .post(createUser);

router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

module.exports = router;
