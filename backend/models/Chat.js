const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  type: { type: String, enum: ['user', 'system'], required: true },
  timestamp: { type: Date, default: Date.now },
});

const chatSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  name: { type: String, default: 'New Chat' },
  createdAt: { type: Date, default: Date.now },
  messages: [messageSchema],
});

module.exports = mongoose.model('Chat', chatSchema);