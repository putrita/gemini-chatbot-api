const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const userMessage = input.value.trim();

  if (!userMessage) return; // Basic client-side validation

  appendMessage('user', userMessage);
  input.value = "";

  // Show a thinking indicator
  const thinkingMsgElement = appendMessage('bot', 'Gemini is thinking...');

  try {
    const response = await fetch('/api/chat', {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage
      }),
    });

    if (!response.ok) { // improved error
      throw new Error(`HTTP error! status: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data || !data.response) {
        throw new Error('Invalid response from server');
    }


    const botMessage = data.response;

    // Update the thinking message with the actual response
    thinkingMsgElement.textContent = botMessage;
  } catch (error) {
    console.error('Fetch error:', error);
    // Update the thinking message with an error
    thinkingMsgElement.textContent = `Sorry, something went wrong: ${error.message ?? 'Unknown error'}`; // More specific error
  } finally {
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
  return msg;
}
