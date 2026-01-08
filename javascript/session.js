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
