const express = require('express');
const alertController = require('../controllers/alertController.js');

const router = express.Router();

// router.get('/data', getData);



// Get all alerts
router.get('/', alertController.getAllAlerts);

// Get recent alerts for dashboard
router.get('/recent', alertController.getRecentAlerts);

// Get alert by ID
router.get('/:id', alertController.getAlertById);

// Create new alert
router.post('/', alertController.createAlert);

// Update alert
router.put('/:id', alertController.updateAlert);

// Delete alert
router.delete('/alerts/:id', alertController.deleteAlert);

module.exports = router;
