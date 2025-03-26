const chatService = require('./chat-service');
const { createProxyMiddleware } = require('http-proxy-middleware');

function setupRoutes(app) {
  // Chat endpoint
  app.post('/api/chat', async (req, res) => {
    try {
      const userMessage = req.body.message;
      if (!userMessage) {
        return res.status(400).json({ error: "No message provided." });
      }

      // Add user message to history
      chatService.addUserMessage(userMessage);
      
      // Format the prompt with conversation history
      const fullPrompt = chatService.formatConversationPrompt();

      // Call the locally running Ollama server
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: fullPrompt,
          model: "llama3.2:latest",
          stream: false
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
      
      // Preserve any markdown formatting in the response
      const aiResponse = data.response || "[No response]";
      
      // Add AI response to history
      chatService.addAiResponse(aiResponse);
      
      // Send the response back to the client
      res.json({ text: aiResponse });
    } catch (error) {
      console.error("Error in /api/chat:", error);
      res.status(500).json({ error: "Server error while generating text." });
    }
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
}

module.exports = { setupRoutes };