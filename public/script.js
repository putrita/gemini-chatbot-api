const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');
let typingIndicator = null; // Variabel untuk menyimpan elemen indikator

form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = ''; // Kosongkan input setelah mengirim
    disableInput(true); // Opsional: Nonaktifkan input/button saat menunggu
    showTypingIndicator(); // Tampilkan indikator sebelum fetch

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
  } finally {
    hideTypingIndicator(); // Sembunyikan indikator setelah fetch selesai
    disableInput(false); // Opsional: Aktifkan kembali input/button
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Fungsi untuk menampilkan indikator "typing..."
function showTypingIndicator() {
    if (!typingIndicator) {
        typingIndicator = document.createElement('div');
        // Menerapkan kelas yang sama dengan pesan bot untuk konsistensi gaya, ditambah kelas khusus
        typingIndicator.classList.add('message', 'bot', 'typing-indicator');
        typingIndicator.textContent = 'AI is thinking...'; // Anda bisa ganti teks ini
        chatBox.appendChild(typingIndicator);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll ke pesan terbaru
    }
}

// Fungsi untuk menyembunyikan indikator "typing..."
function hideTypingIndicator() {
    if (typingIndicator && chatBox.contains(typingIndicator)) {
        chatBox.removeChild(typingIndicator);
        typingIndicator = null;
    }
}

// Opsional: Fungsi untuk menonaktifkan input dan tombol saat menunggu
function disableInput(disabled) {
    input.disabled = disabled;
    form.querySelector('button').disabled = disabled;
}