const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a document title'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
  },
  fileUrl: {
    type: String,
    required: [true, 'File URL is required'],
  },
  publicId: {
    type: String,
    required: [true, 'Cloudinary public ID is required'],
  },
  fileType: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  fileName: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default: null,
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required'],
  },
});

// Add indexes for better query performance
documentSchema.index({ title: 'text', description: 'text' });
documentSchema.index({ uploadedAt: -1 });

module.exports = mongoose.model('Document', documentSchema);
