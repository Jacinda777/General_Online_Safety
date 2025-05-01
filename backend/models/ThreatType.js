const mongoose = require('mongoose');

const threatTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Threat name is required'],
    trim: true,
    unique: true,
    index: true // Explicit index for clarity
  },
  description: {
    type: String,
    trim: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  value: {
    type: Number,
    default: 0,
    min: 0 // Added to prevent negative values
  },
  color: {
    type: String,
    default: '#3b82f6'
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

threatTypeSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('ThreatType', threatTypeSchema);
