# Webix-Ollama Chat Application

A modern, responsive chat interface for interacting with locally-running Ollama LLMs, built with the Webix UI framework.

## Features

- 💬 Clean chat interface
- 🤖 Direct integration with locally-running Ollama LLMs
- 🚀 Fast responses with optimized data handling
- 📱 Responsive design that works on various screen sizes
- 🎨 UI powered by Webix components and Material Design icons
- ⚡ Node.js backend with Express for handling API requests

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/en/) (v18.0.0 or higher recommended)
- [Ollama](https://ollama.ai/download) (must be running locally on port 11434)
- The Llama 3.2 model for Ollama:
  ```
  ollama pull llama3.2:latest
  ```

## Installation

1. Clone this repository.

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Start the server:

   ```bash
   npm start
   ```

4. Open your browser and visit:
   ```
   http://localhost:8080
   ```

## How It Works

### Architecture

The application consists of three main components:

1. **Frontend UI (Webix)**: The user interface built with Webix components
2. **Backend Server (Express)**: Handles API requests and proxies them to Ollama
3. **Ollama LLM**: Processes natural language requests and generates responses

### Data Flow

1. User enters a message in the chat interface
2. Message is sent to the Express backend server
3. Server forwards the request to the locally running Ollama instance
4. Ollama processes the message and generates a response
5. Response is sent back through the server to the frontend
6. Frontend displays the response in the chat interface

### Key Files

- `index.html`: Contains the Webix UI components and frontend JavaScript
- `server.js`: The Express server that handles API requests and Ollama integration
- `package.json`: Project configuration and dependencies

## Customization

### Changing the Ollama Model

To use a different Ollama model, modify the `model` parameter in `server.js`:

```javascript
// In server.js
body: JSON.stringify({
  prompt: userMessage,
  model: "llama3.2:latest", // Change this to another model
  stream: false,
});
```

Remember to pull the model first with `ollama pull model-name:tag`.

### Styling the Interface

The styling is defined in the `<style>` section of `index.html`. You can modify colors, sizes, and other CSS properties to match your design preferences.

### Adding Features

You can extend the application by:

- Implementing user authentication
- Supporting file uploads/attachments
- Enabling voice input/output
- Creating different chat personas

## Troubleshooting

### Common Issues

- **"Error connecting to Ollama"**: Make sure Ollama is running locally on port 11434
- **"Model not found"**: Ensure you've pulled the specified model with `ollama pull llama3.2:latest`
- **Slow responses**: Check your system resources; LLMs can be resource-intensive

### Debugging

- Check browser console for frontend errors
- Review server logs in the terminal
- Test the Ollama API directly using tools like curl or Postman

## How the Application Works

### 1Component Architecture

The application has three main parts:

Frontend: A clean UI built with Webix components and styled with CSS
Backend: A Node.js server using Express to handle API requests
LLM Engine: Ollama running locally, processing the actual AI requests

### 2. Data Flow

When someone uses your app:

The user clicks the robot icon in the toolbar to open the chat window
They type a message and press Enter or click "Send"
The message gets sent to your Node.js server via an API call
Your server forwards this request to the locally running Ollama instance
Ollama processes the request using the Llama 3.2 model
The AI-generated response travels back through your server to the UI
The response appears in the chat window as a message from the AI

### 3. Key Technical Features

Responsive Design: The chat bubbles properly wrap text and adjust to content length
State Management: The UI shows loading indicators while waiting for responses
Error Handling: Both the frontend and backend have proper error handling
API Integration: Clean separation between frontend and AI communication

### 4. For Developers

If developers want to modify the application:

The Webix UI components and styling are in index.html
Server configuration and API handling are in server.js
They can change the Ollama model by modifying the "model" parameter in server.js
The application runs on port 8080 by default but can be changed

### 5. Requirements

To run the application:

Node.js v18+ (for native fetch support)
Ollama installed and running locally on port 11434
The Llama 3.2 model pulled in Ollama

The comprehensive README I provided gives all the details, including installation instructions, customization options, troubleshooting tips, and technical details. It should serve as a great guide for anyone who wants to understand, use, or modify your application.

## Technical Details

### Frontend

- **Webix UI**: For responsive UI components
- **Material Design Icons**: For visual elements
- **Vanilla JavaScript**: For frontend logic

### Backend

- **Express.js**: Web server framework
- **HTTP-Proxy-Middleware**: For proxying requests to Ollama
- **Body-Parser**: For parsing JSON request bodies

### API Endpoints

- `/api/chat`: Direct endpoint for sending messages to Ollama
- `/api/ollama/*`: Proxy endpoint that forwards requests to Ollama's API

## Credits

- [Webix](https://webix.com/): UI components
- [Ollama](https://ollama.ai/): Local LLM runtime
- [Express](https://expressjs.com/): Node.js web framework
- [Material Design Icons](https://materialdesignicons.com/): Icon set

## License

[ISC License](LICENSE)

---

Created by [Your Name] - [Your Website/GitHub]
