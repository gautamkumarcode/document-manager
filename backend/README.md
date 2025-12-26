# Document Management Backend

A robust document management system built with Node.js, Express, MongoDB, and Cloudinary for secure file storage and management.

## 🚀 Features

- **Document Upload**: Upload various file types (images, PDFs, Office documents)
- **Cloud Storage**: Secure file storage using Cloudinary
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Search & Pagination**: Search documents and paginated results
- **File Validation**: Type and size validation (10MB limit)
- **REST API**: Clean and well-documented API endpoints

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account

## 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd document-management
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env` file in the root directory:
   ```env
   # MongoDB Configuration
   MONGODB_URI=mongodb://localhost:27017/document-management
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   ```

4. **Start the server**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api/documents
```

### Endpoints

#### 1. Upload Document
```http
POST /api/documents/upload
Content-Type: multipart/form-data

Body:
- file: (file) - The document file
- title: (string, optional) - Document title
- description: (string, optional) - Document description
- uploadedBy: (string, optional) - Uploader name
```

**Response:**
```json
{
  "success": true,
  "message": "Document uploaded successfully",
  "data": {
    "_id": "...",
    "title": "Sample Document",
    "description": "Description here",
    "fileUrl": "https://cloudinary.com/...",
    "fileType": "application/pdf",
    "fileSize": 1024000,
    "fileName": "sample.pdf",
    "uploadedAt": "2025-12-26T09:29:30.000Z"
  }
}
```

#### 2. Get All Documents
```http
GET /api/documents?page=1&limit=10&search=keyword
```

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search keyword

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 25,
    "page": 1,
    "pages": 3
  }
}
```

#### 3. Get Document by ID
```http
GET /api/documents/:id
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Sample Document",
    ...
  }
}
```

#### 4. Update Document
```http
PUT /api/documents/:id
Content-Type: application/json

Body:
{
  "title": "Updated Title",
  "description": "Updated Description"
}
```

#### 5. Delete Document
```http
DELETE /api/documents/:id
```

**Response:**
```json
{
  "success": true,
  "message": "Document deleted successfully"
}
```

## 📁 Project Structure

```
document-management/
├── config/
│   ├── database.js       # MongoDB configuration
│   └── cloudinary.js     # Cloudinary & Multer setup
├── controllers/
│   └── documentController.js  # Business logic
├── middleware/
│   └── errorHandler.js   # Error handling
├── models/
│   └── Document.js       # Document schema
├── routes/
│   └── documentRoutes.js # API routes
├── .env.example          # Environment template
├── .gitignore
├── package.json
├── server.js             # Entry point
└── README.md
```

## 🔒 Supported File Types

- **Images**: JPG, JPEG, PNG
- **Documents**: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
- **Size Limit**: 10MB per file

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **File Storage**: Cloudinary
- **File Upload**: Multer
- **Environment**: dotenv

## 🧪 Testing with Postman/Thunder Client

1. **Upload a document**: 
   - Method: POST
   - URL: `http://localhost:5000/api/documents/upload`
   - Body: form-data with `file` field

2. **Get all documents**:
   - Method: GET
   - URL: `http://localhost:5000/api/documents`

3. **Delete a document**:
   - Method: DELETE
   - URL: `http://localhost:5000/api/documents/{document_id}`

## 📝 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/documents` |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | `your_cloud_name` |
| `CLOUDINARY_API_KEY` | Cloudinary API key | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | `your_secret_key` |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |

## 🚨 Error Handling

The API includes comprehensive error handling for:
- File size violations (>10MB)
- Invalid file types
- Database validation errors
- Invalid MongoDB ObjectIDs
- Missing required fields

## 📄 License

ISC

## 👨‍💻 Author

Your Name

---

**Happy Coding! 🎉**
