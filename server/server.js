const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./dataBase/database');
const route = require('./routes/route');
require('dotenv').config();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://focus-mate-sage.vercel.app/'],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Security headers for Google OAuth
app.use((req, res, next) => {
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

// Connect to database
connectDB();

// Middleware
app.use(express.json());
app.use(cookieParser());



// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Auth routes (direct, no /api prefix)
app.use('/auth', require('./routes/auth'));

// API routes
app.use('/api', route);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ message: 'Internal server error', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(`CORS origins: http://localhost:5173, https://focus-mate-self.vercel.app`);
});

module.exports = app;
