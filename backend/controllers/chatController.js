const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

exports.sendMessage = async (req, res) => {
  const { content, sessionId } = req.body;

  if (!content || !sessionId) {
    return res.status(400).json({ error: 'Content and sessionId are required' });
  }

  try {
    // Save user message
    let chat = await Chat.findOne({ chatId: sessionId });
    if (!chat) {
      chat = new Chat({ chatId: sessionId, name: `Chat ${sessionId.slice(0, 8)}`, messages: [] });
    }
    chat.messages.push({ content, type: 'user', timestamp: new Date() });
    await chat.save();

    // Prepare conversation history for Gemini
    const conversationHistory = chat.messages
      .map(msg => `${msg.type === 'user' ? 'User' : 'CyberGuard'}: ${msg.content}`)
      .join('\n') + `\nUser: ${content}`;

    // System prompt for CyberGuard Assistant
    const prompt = `You are CyberGuard Assistant, a cybersecurity expert. Provide accurate, concise, and practical cybersecurity advice. Use the following conversation history for context:\n\n${conversationHistory}\n\nCyberGuard:`;

    // Call Gemini API
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Save bot response
    chat.messages.push({ content: responseText, type: 'system', timestamp: new Date() });
    await chat.save();

    res.json({ content: responseText });
  } catch (error) {
    console.error('Error in sendMessage:', error.message);
    res.status(500).json({ content: 'Sorry, something went wrong. Try again later.' });
  }
};

exports.getChats = async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error.message);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

exports.updateChatName = async (req, res) => {
  const { chatId, newName } = req.body;
  try {
    await Chat.findOneAndUpdate({ chatId }, { name: newName });
    res.json({ success: true });
  } catch (error) {
    console.error('Error renaming chat:', error.message);
    res.status(500).json({ error: 'Failed to rename chat' });
  }
};

exports.deleteChat = async (req, res) => {
  const { chatId } = req.params;
  try {
    await Chat.findOneAndDelete({ chatId });
    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting chat:', error.message);
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};