const Document = require('../models/Document');
const { cloudinary } = require('../config/cloudinary');

// @desc    Upload a new document
// @route   POST /api/documents/upload
// @access  Public
exports.uploadDocument = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file',
      });
    }

    // Create document record
    const document = await Document.create({
      title: title || req.file.originalname,
      description: description || '',
      fileUrl: req.file.path,
      publicId: req.file.filename,
      fileType: req.file.mimetype,
      fileSize: req.file.size,
      fileName: req.file.originalname,
      category: category || null,
      uploadedBy: req.user._id, // Use authenticated user ID
    });

    // Populate user and category info
    await document.populate('uploadedBy', 'name email');
    await document.populate('category', 'name');

    res.status(201).json({
      success: true,
      message: 'Document uploaded successfully',
      data: document,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading document',
      error: error.message,
    });
  }
};

// @desc    Get all documents
// @route   GET /api/documents
// @access  Public
exports.getAllDocuments = async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', category } = req.query;

    // Build query - filter by authenticated user
    let query = { uploadedBy: req.user._id };
    
    if (search) {
      query.$text = { $search: search };
    }

    // Filter by category if provided
    if (category) {
      query.category = category;
    }

    const documents = await Document.find(query)
      .populate('uploadedBy', 'name email')
      .populate('category', 'name')
      .sort({ uploadedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Document.countDocuments(query);

    res.status(200).json({
      success: true,
      data: documents,
      pagination: {
        total: count,
        page: Number(page),
        pages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching documents',
      error: error.message,
    });
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Public
exports.getDocumentById = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy', 'name email')
      .populate('category', 'name');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Check if user owns the document
    if (document.uploadedBy._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this document',
      });
    }

    res.status(200).json({
      success: true,
      data: document,
    });
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching document',
      error: error.message,
    });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Public
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Check if user owns the document
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this document',
      });
    }

    // Delete from Cloudinary
    await cloudinary.uploader.destroy(document.publicId, {
      resource_type: 'raw', // Use 'raw' for non-image files
    });

    // Delete from database
    await document.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully',
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting document',
      error: error.message,
    });
  }
};

// @desc    Update document metadata
// @route   PUT /api/documents/:id
// @access  Public
exports.updateDocument = async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Check if user owns the document
    if (document.uploadedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this document',
      });
    }

    // Update fields
    if (title) document.title = title;
    if (description) document.description = description;
    if (category !== undefined) document.category = category || null;

    await document.save();
    await document.populate('uploadedBy', 'name email');
    await document.populate('category', 'name');

    res.status(200).json({
      success: true,
      message: 'Document updated successfully',
      data: document,
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating document',
      error: error.message,
    });
  }
};
