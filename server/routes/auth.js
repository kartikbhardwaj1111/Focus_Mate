const express = require('express');
const router = express.Router();


// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Auth routes working', timestamp: new Date().toISOString() });
});



module.exports = router;