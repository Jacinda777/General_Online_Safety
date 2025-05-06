const { GoogleGenerativeAI } = require('@google/generative-ai');
const Chat = require('../models/Chat');

// Validate environment variables
if (!process.env.GEMINI_API_KEY) {
    console.error('GEMINI_API_KEY is not set in the environment variables.');
    throw new Error('GEMINI_API_KEY is missing. Please set it in the .env file.');
}

// Initialize Gemini API
let genAI;
let model;
try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
} catch (error) {
    console.error('Failed to initialize Gemini API:', error.message);
    throw new Error('Failed to initialize Gemini API. Please check the GEMINI_API_KEY and network connection.');
}

// Basic input sanitization
const sanitizeInput = (input) => {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[<>]/g, '');
};

exports.sendMessage = async (req, res) => {
    const { content, sessionId } = req.body;

    if (!content || !sessionId) {
        return res.status(400).json({ error: 'Content and sessionId are required' });
    }

    const sanitizedContent = sanitizeInput(content);
    const sanitizedSessionId = sanitizeInput(sessionId);

    if (!sanitizedContent || !sanitizedSessionId) {
        return res.status(400).json({ error: 'Invalid content or sessionId' });
    }

    try {
        // Save user message to MongoDB
        let chat;
        try {
            chat = await Chat.findOne({ chatId: sanitizedSessionId });
            if (!chat) {
                chat = new Chat({ chatId: sanitizedSessionId, name: `Chat ${sanitizedSessionId.slice(0, 8)}`, messages: [] });
            }
            chat.messages.push({ content: sanitizedContent, type: 'user', timestamp: new Date() });
            await chat.save();
        } catch (dbError) {
            console.error('Database error in sendMessage (saving user message):', dbError.message);
            throw new Error('Failed to save user message to database.');
        }

        // Prepare conversation history for Gemini
        const conversationHistory = chat.messages
            .map(msg => `${msg.type === 'user' ? 'User' : 'CyberGuard'}: ${msg.content}`)
            .join('\n') + `\nUser: ${sanitizedContent}`;

        // System prompt for CyberGuard Assistant
        const prompt = `You are CyberGuard Assistant, a cybersecurity expert. Provide accurate, concise, and practical cybersecurity advice. Use the following conversation history for context:\n\n${conversationHistory}\n\nCyberGuard:`;

        // Call Gemini API
        let result;
        try {
            result = await model.generateContent(prompt);
        } catch (apiError) {
            console.error('Gemini API error in sendMessage:', apiError.message);
            throw new Error('Failed to get response from Gemini API.');
        }

        const responseText = sanitizeInput(result.response.text());

        // Save bot response to MongoDB
        try {
            chat.messages.push({ content: responseText, type: 'system', timestamp: new Date() });
            await chat.save();
        } catch (dbError) {
            console.error('Database error in sendMessage (saving bot response):', dbError.message);
            throw new Error('Failed to save bot response to database.');
        }

        res.json({ content: responseText });
    } catch (error) {
        console.error('Error in sendMessage:', error.message);
        if (error.message.includes('Quota exceeded')) {
            return res.status(429).json({ content: 'Rate limit reached. Please try again later.' });
        }
        res.status(500).json({ content: `Sorry, something went wrong: ${error.message}. Try again later.` });
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
    if (!chatId || !newName) {
        return res.status(400).json({ error: 'chatId and newName are required' });
    }
    const sanitizedChatId = sanitizeInput(chatId);
    const sanitizedNewName = sanitizeInput(newName);

    if (!sanitizedChatId || !sanitizedNewName) {
        return res.status(400).json({ error: 'Invalid chatId or newName' });
    }

    try {
        const chat = await Chat.findOneAndUpdate({ chatId: sanitizedChatId }, { name: sanitizedNewName }, { new: true });
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error renaming chat:', error.message);
        res.status(500).json({ error: 'Failed to rename chat' });
    }
};

exports.deleteChat = async (req, res) => {
    const { chatId } = req.params;
    if (!chatId) {
        return res.status(400).json({ error: 'chatId is required' });
    }
    const sanitizedChatId = sanitizeInput(chatId);

    if (!sanitizedChatId) {
        return res.status(400).json({ error: 'Invalid chatId' });
    }

    try {
        const chat = await Chat.findOneAndDelete({ chatId: sanitizedChatId });
        if (!chat) {
            return res.status(404).json({ error: 'Chat not found' });
        }
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting chat:', error.message);
        res.status(500).json({ error: 'Failed to delete chat' });
    }
};