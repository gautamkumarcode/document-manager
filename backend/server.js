require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const connectDB = require('./config/database');
const documentRoutes = require('./routes/documentRoutes');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const errorHandler = require('./middleware/errorHandler');

// Initialize Express app
const app = express();

// Connect to MongoDB
// Middleware
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// CORS configuration - allow credentials and specific origin
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Document Management API',
    version: '1.0.0',
    endpoints: {
      register: 'POST /api/auth/register',
      login: 'POST /api/auth/login',
      getProfile: 'GET /api/auth/profile',
      updateProfile: 'PUT /api/auth/profile',
      createCategory: 'POST /api/categories',
      getCategories: 'GET /api/categories',
      getCategory: 'GET /api/categories/:id',
      updateCategory: 'PUT /api/categories/:id',
      deleteCategory: 'DELETE /api/categories/:id',
      uploadDocument: 'POST /api/documents/upload',
      getAllDocuments: 'GET /api/documents',
      getDocument: 'GET /api/documents/:id',
      updateDocument: 'PUT /api/documents/:id',
      deleteDocument: 'DELETE /api/documents/:id',
    },
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/categories', categoryRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/stats', require('./routes/statsRoutes'));

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
// Start server only if not in serverless environment
const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  });
}

module.exports = app;
