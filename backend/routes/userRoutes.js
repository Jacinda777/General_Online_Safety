const express = require('express');
const userController = require('../controllers/userController');
const { protect, admin } = require('../controllers/authController');

const router = express.Router();

router.get('/', protect, admin, userController.getAllUsers);

router.get('/:id', protect, admin, userController.getUserById);

router.post('/', protect, admin, userController.createUser);

// This is how a PUT route should look
router.put('/users/:id', (req, res) => {
    // Your update logic here
    res.status(200).json({ message: 'User updated' });
});

router.delete('/:id', protect, admin, userController.deleteUser);

module.exports = router;