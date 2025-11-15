const chatBox = document.getElementById("chat-box");
const input = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");
const closeBtn = document.getElementById("close-btn");
const refreshBtn = document.getElementById("refresh-btn");
const chatbot = document.getElementById("chatbot");
const toggleBtn = document.getElementById("chat-toggle");

const BACKEND_URL = "http://localhost:5678/webhook/scriptbees-gifty"; // your n8n webhook

// 🧹 On load
window.addEventListener("load", () => {
  resetChat();
  toggleBtn.style.display = "none";
});

sendBtn.addEventListener("click", sendMessage);
input.addEventListener("keypress", (e) => e.key === "Enter" && sendMessage());
closeBtn.addEventListener("click", () => {
  chatbot.style.display = "none";
  toggleBtn.style.display = "flex";
});
toggleBtn.addEventListener("click", () => {
  chatbot.style.display = "flex";
  toggleBtn.style.display = "none";
});
refreshBtn.addEventListener("click", resetChat);

// 💬 Reset Chat
function resetChat() {
  chatBox.innerHTML = "";
  addBotMessage(`
    <strong>I am Gifty AI 😊</strong><br>
    I can recommend amazing gift ideas for any occasion — just ask me about an event or celebration!
  `);
}

// ➕ Message UI helpers
function addUserMessage(text) {
  const msg = document.createElement("div");
  msg.classList.add("user-message");
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function addBotMessage(html) {
  const msg = document.createElement("div");
  msg.classList.add("bot-message");
  msg.innerHTML = html;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ✅ MAIN SEND FUNCTION
async function sendMessage(messageText) {
  const userMessage = messageText || input.value.trim();
  if (!userMessage) return;

  addUserMessage(userMessage);
  input.value = "";

  // Show “thinking” message
  const thinking = document.createElement("div");
  thinking.classList.add("bot-message");
  thinking.textContent = "💭 Gifty is thinking...";
  chatBox.appendChild(thinking);
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const res = await fetch(BACKEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userMessage }),
    });

    const data = await res.json();
    thinking.remove();
    addBotMessage(data.reply || data.json?.reply || "⚠️ Unexpected response.");

  } catch (error) {
    thinking.remove();
    addBotMessage("⚠️ Sorry! Something went wrong connecting to Gifty.");
  }
}

// 🧠 HANDLE BACKEND BUTTON CLICKS (dynamic listener)
document.addEventListener("click", (e) => {
  if (e.target && e.target.matches("button[data-msg]")) {
    const message = e.target.getAttribute("data-msg");
    sendMessage(message);
  }
});
