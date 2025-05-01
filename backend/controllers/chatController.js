const ChatMessage = require('../models/ChatMessage');
const axios = require('axios');

// Environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

// Helper function to call Gemini API
async function getGeminiResponse(userMessage, history = []) {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [
          {
            parts: [
              {
                text: 'You are CyberGuard Assistant, an AI specialized in online safety and cybersecurity. Provide accurate, helpful responses about staying safe online, including topics like passwords, phishing, encryption, malware, VPNs, Wi-Fi security, 2FA, and backups. Keep responses concise and practical.'
              }
            ]
          },
          ...history.map(msg => ({
            parts: [{ text: msg.content }],
            role: msg.isUser ? 'user' : 'model' // Gemini uses 'model' for assistant
          })),
          {
            parts: [{ text: userMessage }],
            role: 'user'
          }
        ],
        generationConfig: {
          maxOutputTokens: 1000, // Increased for better responses
          temperature: 0.7
        }
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Check for valid response
    if (!response.data.candidates || !response.data.candidates[0]?.content?.parts[0]?.text) {
      throw new Error('Invalid API response format');
    }

    return response.data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error('Error calling Gemini API:', error.response?.data || error.message);
    return 'Sorry, I encountered an issue. How can I assist you with online safety?';
  }
}

exports.sendMessage = async (req, res) => {
  const { message } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required and must be a string' });
  }

  try {
    const userMessageDoc = await ChatMessage.create({ content: message, isUser: true });

    const history = await ChatMessage.find()
      .sort({ timestamp: -1 })
      .limit(5)
      .lean();
    history.reverse();

    const reply = await getGeminiResponse(message, history);

    await ChatMessage.create({ content: reply, isUser: false });

    res.json({ reply });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.status(500).json({ reply: 'An error occurred. Please try again.' });
  }
};

exports.getHistory = async (req, res) => {
  try {
    const messages = await ChatMessage.find().sort({ timestamp: 1 });
    res.json({ messages });
  } catch (error) {
    console.error('Error in getHistory:', error);
    res.status(500).json({ error: 'Failed to fetch message history' });
  }
};