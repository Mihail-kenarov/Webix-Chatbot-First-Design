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

// Direct API endpoint to Ollama
app.post('/api/chat', async (req, res) => {
  try {
    const userMessage = req.body.message;
    if (!userMessage) {
      return res.status(400).json({ error: "No message provided." });
    }

    // Call the locally running Ollama server using native fetch (Node.js 18+)
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: userMessage,
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
    
    // Send the response back to the client
    res.json({ text: data.response || "[No response]" });
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