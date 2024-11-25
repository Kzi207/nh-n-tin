const messagesDiv = document.getElementById('messages');
const input = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

// Kết nối tới WebSocket server
const ws = new WebSocket('ws://localhost:3000');

// Xử lý khi nhận tin nhắn từ server
ws.onmessage = (event) => {
    const message = event.data; // Dữ liệu từ server
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messagesDiv.appendChild(messageDiv);
};

// Gửi tin nhắn khi bấm nút
sendBtn.addEventListener('click', () => {
    const message = input.value.trim();
    if (message) {
        ws.send(message); // Gửi tin nhắn tới server
        input.value = ''; // Xóa input sau khi gửi
    }
});

// Gửi tin nhắn khi nhấn Enter
input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        sendBtn.click();
    }
});
