const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const studentRoutes = require('./routes/students');
const { initDatabase } = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(express.json()); // Alternative JSON parser

// Initialize database
initDatabase();

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Student Management API is running',
    timestamp: new Date().toISOString()
  });
});

// Student routes
app.use('/students', studentRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Student Management API',
    endpoints: {
      health: 'GET /health',
      students: {
        list: 'GET /students',
        get: 'GET /students/:id',
        create: 'POST /students',
        update: 'PUT /students/:id',
        delete: 'DELETE /students/:id'
      }
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
