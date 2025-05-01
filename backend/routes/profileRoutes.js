const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Authentication routes
router.post('/auth/register', profileController.register);
router.post('/auth/login', profileController.login);

// Profile routes
router.get('/', profileController.authenticate, profileController.fetchProfile);
router.put('/', profileController.authenticate, profileController.saveProfile);
router.put('/security', profileController.authenticate, profileController.updateSecuritySettings);
router.delete('/', profileController.authenticate, profileController.deleteAccount);

module.exports = router;