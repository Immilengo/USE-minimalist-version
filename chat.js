// Elementos
const conversationsEl = document.getElementById('conversations');
const chatMessagesEl = document.getElementById('chatMessages');
const chatHeaderEl = document.getElementById('chatHeader');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const newConversationInput = document.getElementById('newConversation');
const createConversationBtn = document.getElementById('createConversationBtn');

let conversations = JSON.parse(localStorage.getItem('conversations')) || [];
let currentConversation = null;

// Renderizar lista de conversas
function renderConversations() {
  conversationsEl.innerHTML = '';
  conversations.forEach(conv => {
    const div = document.createElement('div');
    div.className = 'conversation-item' + (currentConversation && currentConversation.id === conv.id ? ' active' : '');
    div.textContent = conv.name;
    div.onclick = () => selectConversation(conv.id);
    conversationsEl.appendChild(div);
  });
}

// Selecionar conversa
function selectConversation(id) {
  currentConversation = conversations.find(c => c.id === id);
  chatHeaderEl.textContent = currentConversation.name;
  messageInput.disabled = false;
  sendMessageBtn.disabled = false;
  renderMessages();
  renderConversations();
}

// Renderizar mensagens
function renderMessages() {
  chatMessagesEl.innerHTML = '';
  if (!currentConversation) return;
  currentConversation.messages.forEach(msg => {
    const div = document.createElement('div');
    div.className = 'message ' + (msg.user === 'You' ? 'user' : 'other');
    div.textContent = msg.user + ': ' + msg.text;
    chatMessagesEl.appendChild(div);
  });
  chatMessagesEl.scrollTop = chatMessagesEl.scrollHeight;
}

// Criar nova conversa
createConversationBtn.addEventListener('click', () => {
  const name = newConversationInput.value.trim();
  if (!name) return;
  const newConv = {
    id: Date.now(),
    name,
    messages: []
  };
  conversations.push(newConv);
  localStorage.setItem('conversations', JSON.stringify(conversations));
  newConversationInput.value = '';
  renderConversations();
});

// Enviar mensagem
sendMessageBtn.addEventListener('click', () => {
  const text = messageInput.value.trim();
  if (!text || !currentConversation) return;

  currentConversation.messages.push({ user: 'You', text });
  // Simula resposta do parceiro de aprendizagem
  currentConversation.messages.push({ user: 'Partner', text: 'Thanks! You said: ' + text });

  localStorage.setItem('conversations', JSON.stringify(conversations));
  messageInput.value = '';
  renderMessages();
});
 
// Inicialização
renderConversations();
