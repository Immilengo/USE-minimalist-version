export async function loadSidebar(activePage) {
  const container = document.getElementById("sidebar-container");
  if (!container) return;

  const res = await fetch("/components/sidebar/sidebar.html");
  container.innerHTML = await res.text();

  // Ativar menu atual
  container.querySelectorAll(".menu a").forEach(link => {
    if (link.dataset.page === activePage) {
      link.classList.add("active");
    }
  });

  // Avatar (opcional)
  const user = JSON.parse(localStorage.getItem("loggedUser"));
  if (user?.name) {
    document.getElementById("sidebarAvatar").innerText =
      user.name.charAt(0).toUpperCase();
  }
}
