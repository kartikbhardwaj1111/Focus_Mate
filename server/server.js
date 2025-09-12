const express = require('express');
const PORT = process.env.PORT || 3000;
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./dataBase/database');
const route = require('./routes/route');
require('dotenv').config();

app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:5173', 'https://your-netlify-app.netlify.app'],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Cookie'],
}));

// Add security headers for Google OAuth
app.use((req, res, next) => {
  res.header('Cross-Origin-Embedder-Policy', 'unsafe-none');
  next();
});

connectDB();

app.use(express.json());
app.use(cookieParser());
// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api', route);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
