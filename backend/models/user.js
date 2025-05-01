const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: { 
        type: String, 
        required: [true, 'Username is required'], 
        unique: true, 
        trim: true, 
        index: true 
    },
    email: { 
        type: String, 
        required: [true, 'Email is required'], 
        unique: true, 
        trim: true, 
        index: true 
    },
    bio: {
        type: String,
        maxlength: 150,
        trim: true,
    },
    phone: {
        type: String,
        trim: true,
    },
    role: {
        type: String,
        enum: ['User', 'Admin'],
        default: 'User',
    },
    avatar: {
        type: String,
        default: 'images/avatars/avatar1.png',
    },
    twoFactorEnabled: {
        type: Boolean,
        default: false,
    },
    receiveNotifications: {
        type: Boolean,
        default: true,
    },
    stats: {
        articlesRead: { type: Number, default: 0 },
        tipsViewed: { type: Number, default: 0 },
        profileCompletion: { type: Number, default: 0 },
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'], 
        minlength: 8,
        match: [/^(?=.*[A-Z])(?=.*[0-9]).*$/, 'Password must include an uppercase letter and a number'] 
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    lastPasswordChange: { type: Date },
    lastLogin: { type: Date },
    role: { type: String, enum: ['Admin', 'User'], default: 'User' },
    status: { type: String, enum: ['Active', 'Inactive', 'Suspended'], default: 'Active' }
});

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  try {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
      this.lastPasswordChange = Date.now();
      next();
  } catch (error) {
      console.error('Bcrypt hashing error:', error);
      next(error); // Pass error to Mongoose
  }
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
      return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
      console.error('Bcrypt compare error:', error);
      throw new Error('Password comparison failed');
  }
};

module.exports = mongoose.model('User', userSchema);