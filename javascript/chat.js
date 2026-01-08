let chatAtual = null;
let chats = JSON.parse(localStorage.getItem('chats')) || {};

function abrirChat(usuario) {
  chatAtual = usuario;
  document.getElementById('chatUser').innerText = usuario;
  document.getElementById('chatWindow').classList.remove('hidden');
  document.getElementById('noChat').classList.add('hidden');

  renderMensagens();
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

function renderMensagens() {
  const container = document.getElementById('messages');
  container.innerHTML = '';

  (chats[chatAtual] || []).forEach(msg => {
    const div = document.createElement('div');
    div.className = `message ${msg.autor}`;
    div.innerHTML = `
      ${msg.texto}
      <div class="actions">
        <i class='bx bx-trash' onclick="apagarMensagem(${msg.id})"></i>
      </div>
    `;
    container.appendChild(div);
  });

  container.scrollTop = container.scrollHeight;
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