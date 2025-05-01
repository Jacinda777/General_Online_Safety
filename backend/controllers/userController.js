const express = require('express');
const User = require('../models/User.js'); 

const userController = {
  /**
   * Get all users
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find().select('-password');
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  },

  /**
   * Get user by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getUserById: async (req, res) => {
    try {
      const user = await User.findById(req.params.id).select('-password');
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
  },

  createUser: async (req, res) => {
    try {
      const { name, email, role, status, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ message: 'Name, email, and password are required' });
      }

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = await User.create({
        name,
        email,
        role: role || 'User',
        status: status || 'Active',
        password: hashedPassword,
      });

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
        createdAt: user.createdAt,
      });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      await user.deleteOne(); // Changed from remove() to deleteOne()
      
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  }
};

module.exports = userController;
