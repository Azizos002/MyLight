const express = require('express');
const { protect } = require('../middleware/authMiddleware'); // Correct import
const router = express.Router();

router.get('/profile', protect, (req, res) => {
  res.json({ message: 'Welcome to your profile', user: req.user });
});

module.exports = router;
