const axios = require('axios');
const Chat = require('../models/Chat');

exports.sendMessage = async (req, res) => {
  const { content, sessionId } = req.body;
  try {
    // Save user message
    let chat = await Chat.findOne({ chatId: sessionId });
    if (!chat) {
      chat = new Chat({ chatId: sessionId, name: `Chat ${sessionId.slice(0, 8)}`, messages: [] });
    }
    chat.messages.push({ content, type: 'user', timestamp: new Date() });
    await chat.save();

    // Prepare conversation history for Llama 3.1
    const messages = [
      { role: 'system', content: 'You are CyberGuard Assistant, a cybersecurity expert. Provide accurate, concise, and practical cybersecurity advice.' },
      ...chat.messages.map(msg => ({ role: msg.type === 'user' ? 'user' : 'assistant', content: msg.content })),
      { role: 'user', content }
    ];

    // Call Hugging Face Inference API
    const response = await axios.post(
      'https://api-inference.huggingface.co/models/meta-llama/Llama-3.1-70B-Instruct',
      { inputs: messages, parameters: { max_new_tokens: 500, temperature: 0.7 } },
      { headers: { Authorization: `Bearer ${process.env.HF_API_KEY}` } }
    );

    // Extract the assistant's response
    const botResponse = response.data[0].generated_text.find(msg => msg.role === 'assistant')?.content || 'Sorry, I couldn’t process that. Try again!';
    
    // Save bot response
    chat.messages.push({ content: botResponse, type: 'system', timestamp: new Date() });
    await chat.save();

    res.json({ content: botResponse });
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
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};

exports.updateChatName = async (req, res) => {
  const { chatId, newName } = req.body;
  try {
    await Chat.findOneAndUpdate({ chatId }, { name: newName });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to rename chat' });
  }
};

exports.deleteChat = async (req, res) => {
  const { chatId } = req.params;
  try {
    await Chat.findOneAndDelete({ chatId });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete chat' });
  }
};