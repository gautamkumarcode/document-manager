const express = require('express');
const router = express.Router();
const {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { protect } = require('../middleware/auth');
const { adminAuth } = require('../middleware/adminAuth');

// All routes require authentication
// Admin-only routes: create, update, delete
router.post('/', protect, adminAuth, createCategory);
router.get('/', protect, getAllCategories);
router.get('/:id', protect, getCategoryById);
router.put('/:id', protect, adminAuth, updateCategory);
router.delete('/:id', protect, adminAuth, deleteCategory);

module.exports = router;
