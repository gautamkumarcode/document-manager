const express = require('express');
const router = express.Router();
const {
  uploadDocument,
  getAllDocuments,
  getDocumentById,
  deleteDocument,
  updateDocument,
} = require('../controllers/documentController');
const { upload } = require('../config/cloudinary');
const { protect } = require('../middleware/auth');

// All routes are protected (require authentication)
router.post('/upload', protect, upload.single('file'), uploadDocument);
router.get('/', protect, getAllDocuments);
router.get('/:id', protect, getDocumentById);
router.put('/:id', protect, updateDocument);
router.delete('/:id', protect, deleteDocument);

module.exports = router;
