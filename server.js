const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { setupRoutes } = require('./src/api-routes');

const app = express();
const PORT = 8080;

// Enable CORS for all origins during development
app.use(cors());

// Parse JSON bodies
app.use(bodyParser.json());

// Serve static files
app.use(express.static('./public'));

// Setup all routes
setupRoutes(app);

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