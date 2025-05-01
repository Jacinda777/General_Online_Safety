const express = require('express');
const dashboardController = require('../controllers/dashboardController');
const { protect } = require('../controllers/authController');
const router = express.Router();


router.get('/', protect, dashboardController.getDashboard);

module.exports = router;