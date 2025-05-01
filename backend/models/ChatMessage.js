const mongoose = require('mongoose');

const chatMessageSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true // Added to remove whitespace
  },
  isUser: {
    type: Boolean,
    required: [true, 'isUser flag is required']
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true // Added for sorting by time
  }
});

module.exports = mongoose.model('ChatMessage', chatMessageSchema);