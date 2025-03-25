const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 8080;

// Enable CORS for all origins during development
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Serve static files
app.use(express.static('./'));

// Store conversation history in memory (simple implementation)
let conversationHistory = [];
const MAX_HISTORY_LENGTH = 20; // Keep the last 20 messages

// Direct API endpoint to Ollama
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "No message provided." });
    }

    // Add user message to history
    conversationHistory.push({ role: 'user', content: userMessage });
    
    // Format the prompt with conversation history
    let fullPrompt = '';
    
    // Format the history into a conversation format
    conversationHistory.forEach((msg) => {
      if (msg.role === 'user') {
        fullPrompt += `Human: ${msg.content}\n`;
      } else {
        fullPrompt += `Assistant: ${msg.content}\n`;
      }
    });
    
    fullPrompt += 'Assistant: '; // Prompt the model to respond as assistant

    // Call the locally running Ollama server using native fetch (Node.js 18+)
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: fullPrompt,
        model: "llama3.2:latest",  // Using llama3.2 as specified
        stream: false              // No streaming for simplicity
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("Ollama API error:", errorData);
      return res.status(response.status).json({ 
        error: `Ollama API error (${response.status})`, 
        details: errorData 
      });
    }

    // Parse the JSON response from Ollama
    const data = await response.json();
    const aiResponse = data.response || "[No response]";
    
    // Add AI response to history
    conversationHistory.push({ role: 'assistant', content: aiResponse });
    
    // Trim history if it exceeds the maximum length
    if (conversationHistory.length > MAX_HISTORY_LENGTH) {
      // Remove oldest messages
      conversationHistory = conversationHistory.slice(
        conversationHistory.length - MAX_HISTORY_LENGTH
      );
    }
    
    // Send the response back to the client
    res.json({ text: aiResponse });
  } catch (error) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: "Server error while generating text." });
  }
});

// API endpoint to clear chat history
app.post('/api/chat/clear', (req, res) => {
  conversationHistory = [];
  res.json({ message: 'History cleared' });
});

// Proxy middleware for Ollama
const ollamaProxy = createProxyMiddleware({
  target: 'http://localhost:11434',
  changeOrigin: true,
  pathRewrite: {
    '^/api/ollama/generate': '/api/generate'
  },
  onProxyReq: (proxyReq, req) => {
    if (req.body) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.status(500).json({
      error: 'Proxy Error',
      details: err.message
    });
  }
});

app.use('/api/ollama', ollamaProxy);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server Error:', err);
  res.status(500).json({
    error: 'Server Error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Proxying Ollama requests to http://localhost:11434`);
  console.log(`Open http://localhost:${PORT}/index.html in your browser`);
});