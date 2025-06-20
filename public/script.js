const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const userMessage = input.value.trim();
    if (!userMessage) return;

    appendMessage('user', userMessage);
    input.value = ''; // Kosongkan input setelah mengirim

    try {
        // Pastikan URL ini benar sesuai dengan port backend Anda
        const response = await fetch('http://localhost:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: userMessage }),
        });

        if (!response.ok) {
            // Tangani error HTTP (misalnya status 400, 500)
            const errorData = await response.json(); // Coba parse body error
            throw new Error(errorData.reply || errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        appendMessage('bot', data.reply); // Tampilkan balasan dari AI

    } catch (error) {
        console.error('Fetch error:', error);
        appendMessage('bot', `Error: ${error.message}`); // Tampilkan pesan error di chatbox
    }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
