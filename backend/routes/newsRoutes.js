const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');

// Route to fetch cybersecurity news
router.get('/security-news', newsController.getSecurityNews);

module.exports = router;