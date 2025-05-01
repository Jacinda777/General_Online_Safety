const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require('../controllers/authController');

router.post('/chat', protect, chatController.sendMessage);
router.get('/history', protect, chatController.getHistory);

module.exports = router;