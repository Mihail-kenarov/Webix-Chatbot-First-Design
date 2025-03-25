// Chat service logic
let conversationHistory = [];
const MAX_HISTORY_LENGTH = 20;

function addUserMessage(message) {
  conversationHistory.push({ role: 'user', content: message });
}




function addAiResponse(message) {
  conversationHistory.push({ role: 'assistant', content: message });
  
  // Trim history if needed
  if (conversationHistory.length > MAX_HISTORY_LENGTH) {
    conversationHistory = conversationHistory.slice(
      conversationHistory.length - MAX_HISTORY_LENGTH
    );
  }
}



function formatConversationPrompt() {
  let fullPrompt = '';
  
  conversationHistory.forEach((msg) => {
    if (msg.role === 'user') {
      fullPrompt += `Human: ${msg.content}\n`;
    } else {
      fullPrompt += `Assistant: ${msg.content}\n`;
    }
  });
  
  return fullPrompt + 'Assistant: ';
}



function clearHistory() {
  conversationHistory = [];
}



module.exports = {
  addUserMessage,
  addAiResponse,
  formatConversationPrompt,
  clearHistory
};