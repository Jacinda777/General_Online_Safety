import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import OpenAI from 'openai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from the public directory
app.use(express.static('public'));
app.use(express.json());

// API endpoint for chat messages
app.get('/api/messages/:sessionId', (req, res) => {
  // For now, we're returning an empty array since our client-side handles all messages
  res.json([]);
});

// Function to generate AI response
async function generateAIResponse(userMessage) {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: `You are CyberGuard, an AI cybersecurity expert assistant. Your role is to:
          - Provide accurate, up-to-date cybersecurity advice and information
          - Focus on practical, actionable recommendations
          - Explain complex security concepts in simple terms
          - Stay focused on cybersecurity topics
          - Be concise but thorough in your responses
          - If you're not sure about something, acknowledge it and suggest reliable sources for more information
          - Use a professional but friendly tone
          Current year: ${new Date().getFullYear()}`
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error('Error generating AI response:', error);
    return "I apologize, but I'm having trouble processing your request at the moment. Could you please try again? If you're asking about a specific cybersecurity topic, try to be as specific as possible.";
  }
}

// API endpoint to handle message responses
app.post('/api/messages', async (req, res) => {
  const { content, sessionId } = req.body;
  
  if (!content) {
    return res.status(400).json({ error: 'Content is required' });
  }

  try {
    // Generate AI response
    const response = await generateAIResponse(content);
    
    res.json({ 
      id: Date.now(),
      content: response,
      sender: "system",
      timestamp: new Date(),
      sessionId: sessionId || "default-session"
    });
  } catch (error) {
    console.error('Error processing message:', error);
    res.status(500).json({ 
      error: 'An error occurred while processing your message',
      fallbackResponse: true
    });
  }
});

// Catch-all route to serve the main app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(PORT, '443', () => {
  console.log(`Vanilla server running on port ${PORT}`);
});