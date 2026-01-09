function getLoggedUser() {
  return JSON.parse(localStorage.getItem("loggedUser"));
}

function isLoggedIn() {
  return !!localStorage.getItem("loggedUser");
}

function logout() {
  localStorage.removeItem("loggedUser");
  window.location.href = "/html/auth.html";
}

// Delegação de eventos para qualquer botão de call
document.addEventListener("click", function(e) {
  const btn = e.target.closest(".btn-call"); // verifica se clicou no botão de call
  if (!btn) return;

  const card = btn.closest(".user-card");
  if (!card) return;

  const userId = card.dataset.userId; // pega o ID do usuário
  const userName = card.querySelector(".user-name")?.innerText || "User";

  // Redireciona para a tela de call
  window.location.href = `call.html?user=${encodeURIComponent(userId)}&type=audio`;
});
