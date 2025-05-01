const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['Critical', 'Warning', 'Info'],
    required: [true, 'Alert type is required']
  },
  message: {
    type: String,
    required: [true, 'Alert message is required'],
    trim: true
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true // Added for faster sorting/querying
  },
  resolved: {
    type: Boolean,
    default: false,
    index: true // Added for filtering unresolved alerts
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  affectedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: [] // Explicit default
  }],
  affectedDevices: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Device',
    default: [] // Explicit default
  }],
  relatedThreat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ThreatType',
    default: null
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

alertSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

alertSchema.virtual('formattedTime').get(function() {
  const now = new Date();
  const diffMs = now - this.timestamp;
  const diffMins = Math.round(diffMs / 60000);
  const diffHours = Math.round(diffMs / 3600000);
  const diffDays = Math.round(diffMs / 86400000);
  
  if (diffMins < 60) {
    return diffMins === 1 ? '1 minute ago' : `${diffMins} minutes ago`;
  } else if (diffHours < 24) {
    return diffHours === 1 ? '1 hour ago' : `${diffHours} hours ago`;
  } else {
    return diffDays === 1 ? '1 day ago' : `${diffDays} days ago`;
  }
});

alertSchema.set('toJSON', { virtuals: true });
alertSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Alert', alertSchema);