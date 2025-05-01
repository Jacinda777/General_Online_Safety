const express = require('express');
const securityController = require('../controllers/securityController');
const { protect, admin } = require('../controllers/authController');

const router = express.Router();

router.get('/metrics', protect, securityController.getSecurityMetrics);

router.get('/devices', protect, securityController.getDeviceDistribution);

router.get('/threats', protect, securityController.getThreatTypes);

router.get('/stats', protect, securityController.getSecurityStats);

router.post('/metrics', protect, admin, securityController.updateSecurityMetrics);

module.exports = router;