const open = indexedDB.open("use_app");

open.onsuccess = () => {
  const db = open.result;
  loadUsers(db);
};

function loadUsers(db) {
  const tx = db.transaction("users", "readonly");
  const store = tx.objectStore("users");

  store.getAll().onsuccess = e => {
    const users = e.target.result;
    const container = document.getElementById("usersList");

    container.innerHTML = "";

    users.forEach(user => {
      container.innerHTML += createUserCard(user);
    });
  };
}

function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function initiateCall(email) {
  alert("Starting call with " + email);
}


function createUserCard(user) {
  return `
    <div class="user-card">
      <div class="user-card-header">
        <div class="user-avatar">
          <img src="${user.avatar || '/static/img/default-avatar.png'}" alt="${user.name}">
          <span class="online-indicator"></span>
        </div>

        <div class="user-info">
          <div class="user-name">${user.name}</div>
          <div class="user-meta">
            <span class="flag">🇦🇴</span>
            <span class="user-level">${capitalize(user.level)}</span>
          </div>
        </div>
      </div>

      <div class="user-interests">
        ${user.interests.map(i => `
          <span class="interest-tag">${i}</span>
        `).join("")}
      </div>

      <div class="user-stats">
        <span><i class="fas fa-clock"></i> ${user.avgMinutes || 30} min avg</span>
        <span><i class="fas fa-star"></i> ${user.rating || "4.5"}</span>
      </div>

      <button class="btn-call" onclick="initiateCall('${user.email}')">
        <i class="fas fa-phone"></i>
        Start Call
      </button>
    </div>
  `;
}

