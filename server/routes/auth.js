const express = require('express');
const router = express.Router();
const { googleAuth } = require('../controllers/Auth');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working', timestamp: new Date().toISOString() });
});

// Token-based Google auth (for frontend ID token verification)
router.post('/google', googleAuth);

// Simple callback route for Google OAuth redirect URI
router.get('/google/callback', (req, res) => {
  res.redirect('https://focus-mate-self.vercel.app/dashboard');
});

module.exports = router;