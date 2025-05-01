const mongoose = require('mongoose');

const deviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Device name is required'],
    trim: true
  },
  type: {
    type: String,
    enum: ['Mobile', 'Desktop', 'Tablet', 'IoT'],
    required: [true, 'Device type is required']
  },
  lastSeen: {
    type: Date,
    default: Date.now
  },
  securityScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 100
  },
  incidents: {
    type: Number,
    default: 0,
    min: 0 // Added to prevent negative values
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true // Added for faster lookups by owner
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

deviceSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Device', deviceSchema);