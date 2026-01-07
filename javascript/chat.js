let conversations = JSON.parse(localStorage.getItem("conversations")) || [];
let currentChatId = null;

const cardsContainer = document.getElementById("conversations");
const chatCards = document.getElementById("chatCards");
const chatWindow = document.getElementById("chatWindow");
const chatHeader = document.getElementById("chatHeader");
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendMessageBtn = document.getElementById("sendMessageBtn");

function save() {
  localStorage.setItem("conversations", JSON.stringify(conversations));
}

/* RENDER CONVERSATIONS */
function renderConversations() {
  cardsContainer.innerHTML = "";

  if (conversations.length === 0) {
    cardsContainer.innerHTML = `<p style="color:#6b7280">No conversations yet</p>`;
    return;
  }

  conversations.forEach(chat => {
    const card = document.createElement("div");
    card.className = "chat-card";
    card.innerHTML = `
      <div class="chat-card-header">
        <h3>${chat.name}</h3>
        <button class="delete-btn" title="Delete chat">✖</button>
      </div>
      <small>${chat.messages.at(-1)?.text || "No messages yet"}</small>
    `;

    card.querySelector("h3").onclick = () => openChat(chat.id);
    card.querySelector("small").onclick = () => openChat(chat.id);

    card.querySelector(".delete-btn").onclick = (e) => {
      e.stopPropagation();
      deleteChat(chat.id);
    };

    cardsContainer.appendChild(card);
  });
}

/* DELETE CHAT */
function deleteChat(id) {
  const chat = conversations.find(c => c.id === id);
  if (!chat) return;

  const confirmDelete = confirm(`Delete conversation with "${chat.name}"?`);
  if (!confirmDelete) return;

  conversations = conversations.filter(c => c.id !== id);

  if (currentChatId === id) {
    chatWindow.classList.add("hidden");
    chatCards.classList.remove("hidden");
    currentChatId = null;
  }

  save();
  renderConversations();
}

/* OPEN CHAT */
function openChat(id) {
  currentChatId = id;
  const chat = conversations.find(c => c.id === id);

  chatHeader.textContent = chat.name;

  chatCards.classList.add("hidden");
  chatWindow.classList.remove("hidden");

  renderMessages();
}

/* RENDER MESSAGES */
function renderMessages() {
  chatMessages.innerHTML = "";
  const chat = conversations.find(c => c.id === currentChatId);

  chat.messages.forEach(msg => {
    const div = document.createElement("div");
    div.className = "message";
    div.textContent = msg.text;
    chatMessages.appendChild(div);
  });

  chatMessages.scrollTop = chatMessages.scrollHeight;
}

/* CREATE CHAT */
document.getElementById("createConversationBtn").onclick = () => {
  const input = document.getElementById("newConversation");
  const name = input.value.trim();
  if (!name) return;

  conversations.push({
    id: Date.now(),
    userId: null,
    name,
    messages: []
  });

  input.value = "";
  save();
  renderConversations();
};

/* SEND MESSAGE */
sendMessageBtn.onclick = () => {
  const text = messageInput.value.trim();
  if (!text || currentChatId === null) return;

  const chat = conversations.find(c => c.id === currentChatId);
  chat.messages.push({ text });

  messageInput.value = "";
  save();
  renderMessages();
  renderConversations();
};

/* INIT */
renderConversations();
window.openChat = openChat; // para listUsers.js
