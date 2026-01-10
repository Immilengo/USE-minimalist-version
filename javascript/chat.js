let chatAtual = null;
let chats = JSON.parse(localStorage.getItem('chats')) || {};
const urlParams = new URLSearchParams(window.location.search);
const userParam = urlParams.get('user');

if (userParam) {
  // Se tiver um usuário na URL, abrir o chat com ele
  abrirChat(userParam);
}
function abrirChat(email) {
  // Buscar o usuário no IndexedDB
  const openRequest = indexedDB.open("use_app");
  
  openRequest.onsuccess = function(event) {
    const db = event.target.result;
    const tx = db.transaction("users", "readonly");
    const store = tx.objectStore("users");
    const request = store.get(email);

    request.onsuccess = function() {
      const user = request.result;
      if (user) {
        chatAtual = email; // usamos o email como identificador
        // Exibir o nome do usuário no chat
        document.getElementById('chatUser').innerText = user.name;
        document.getElementById('chatWindow').classList.remove('hidden');
        document.getElementById('noChat').classList.add('hidden');

        renderMensagens();
      } else {
        alert('User not found');
      }
    };
  };
}

function enviarMensagem() {
  const input = document.getElementById('messageInput');
  const texto = input.value.trim();
  if (!texto) return;

  if (!chats[chatAtual]) chats[chatAtual] = [];

  chats[chatAtual].push({
    texto,
    autor: 'me',
    id: Date.now()
  });

  salvar();
  input.value = '';
  renderMensagens();
}

function carregarConversas() {
  const container = document.querySelector('.users-list');
  // Limpar a lista atual, exceto o título
  const titulo = container.querySelector('h3');
  container.innerHTML = '';
  container.appendChild(titulo);

  // Obter todos os emails que têm mensagens
  const emails = Object.keys(chats);

  // Para cada email, buscar o usuário no IndexedDB para obter o nome
  const openRequest = indexedDB.open("use_app");
  
  openRequest.onsuccess = function(event) {
    const db = event.target.result;
    const tx = db.transaction("users", "readonly");
    const store = tx.objectStore("users");

    emails.forEach(email => {
      const request = store.get(email);
      request.onsuccess = function() {
        const user = request.result;
        if (user) {
          const div = document.createElement('div');
          div.className = 'user-item';
          div.onclick = () => abrirChat(email);
          div.innerHTML = `
            <div class="user-avatar">${user.name.charAt(0)}</div>
            <div class="user-info">
              <strong>${user.name}</strong><br>
              <small>${user.online ? 'Online' : 'Offline'}</small>
            </div>
          `;
          container.appendChild(div);
        }
      };
    });
  };
}

function apagarMensagem(id) {
  chats[chatAtual] = chats[chatAtual].filter(m => m.id !== id);
  salvar();
  renderMensagens();
}

function arquivarChat() {
  delete chats[chatAtual];
  salvar();
  document.getElementById('chatWindow').classList.add('hidden');
  document.getElementById('noChat').classList.remove('hidden');
}

function salvar() {
  localStorage.setItem('chats', JSON.stringify(chats));
}
function sair(){
    if(confirm("Tem a certeza que deseja sair?")){
      window.location.href="home.html";
    }
  }