const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Input validation helper
const validatePassword = (password) => {
    return password && password.length >= 8 && /[A-Z]/.test(password) && /[0-9]/.test(password);
};

const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  const normalizedEmail = email?.toLowerCase();

  if (!username || !normalizedEmail || !password) {
      return res.status(400).json({ message: 'All fields are required' });
  }

  try {
      let user = await User.findOne({ email: normalizedEmail });
      if (user) {
          return res.status(400).json({ message: 'User already exists' });
      }

      user = new User({
          username,
          email: normalizedEmail,
          password,
          role: role || 'User',
      });
      await user.save();

      const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      res.status(201).json({ 
          token, 
          user: { id: user._id, username, email: normalizedEmail, role: user.role },
          message: 'User created successfully' 
      });
  } catch (error) {
      console.error('Registration error:', error);
      if (error.name === 'ValidationError') {
          return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: 'Server error' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  console.log('Login attempt:', { email, password: '****' });

  if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
      const normalizedEmail = email.toLowerCase();
      const user = await User.findOne({ email: normalizedEmail });
      
      if (!user) {
          console.log('User not found for email:', normalizedEmail);
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
          console.log('Password mismatch for user:', user.email);
          return res.status(401).json({ message: 'Invalid email or password' });
      }

      user.lastLogin = Date.now();
      await user.save();

      const token = jwt.sign(
          { id: user._id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
      );

      res.status(200).json({
          token,
          user: { id: user._id, username: user.username, email: user.email, role: user.role },
          message: 'Login successful'
      });
  } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: 'Server error occurred during login' });
  }
};

const protect = (req, res, next) => {
    const authHeader = req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No valid token, authorization denied' });
    }

    const token = authHeader.replace('Bearer ', '');

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(403).json({ message: 'Admin access required' });
    }
};

const getUserProfile = (req, res) => {
    res.status(200).json({ 
        user: { id: req.user.id, username: req.user.username, role: req.user.role }
    });
};

module.exports = { register, login, protect, admin, getUserProfile };