const express = require('express');
const router = express.Router();
const { register, login, protect, admin, getUserProfile } = require('../controllers/authController');

router.post('/signup', register);
router.post('/login', login);
router.get('/profile', protect, getUserProfile);
router.get('/admin', protect, admin, (req, res) => {
  res.json({ message: 'Welcome, Admin!' });
});

module.exports = router;