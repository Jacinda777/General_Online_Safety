const mongoose = require('mongoose');

const securityMetricSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Period name is required'],
    trim: true
  },
  threats: {
    type: Number,
    required: [true, 'Threats count is required'],
    default: 0,
    min: 0 // Added to prevent negative values
  },
  incidents: {
    type: Number,
    required: [true, 'Incidents count is required'],
    default: 0,
    min: 0 // Added to prevent negative values
  },
  resolved: {
    type: Number,
    required: [true, 'Resolved count is required'],
    default: 0,
    min: 0 // Added to prevent negative values
  },
  month: {
    type: Number,
    required: [true, 'Month is required'],
    min: 1,
    max: 12
  },
  year: {
    type: Number,
    required: [true, 'Year is required']
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

// Compound index to ensure unique month/year combinations
securityMetricSchema.index({ month: 1, year: 1 }, { unique: true });

securityMetricSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SecurityMetric', securityMetricSchema);