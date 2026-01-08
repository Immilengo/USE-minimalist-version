// ================================
// INDEXED DB
// ================================
const open = indexedDB.open("use_app");

open.onsuccess = () => {
  const db = open.result;
  window.appDB = db;
  loadUsers(db);
};

// ================================
// LOAD USERS
// ================================
function loadUsers(db) {
  const tx = db.transaction("users", "readonly");
  const store = tx.objectStore("users");

  store.getAll().onsuccess = e => {
    const users = e.target.result;
    window.usersCache = users; // cache global
    const container = document.getElementById("usersList");

    container.innerHTML = "";

    users.forEach(user => {
      container.innerHTML += createUserCard(user);
    });
  };
}

// ================================
// HELPERS
// ================================
function capitalize(text) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getUserByEmail(email) {
  return window.usersCache.find(u => u.email === email);
}

// ================================
// CALL SCREEN LOGIC
// ================================
let callInterval;
let seconds = 0;

function initiateCall(email) {
  const user = getUserByEmail(email);
  if (!user) return;

  document.getElementById("callAvatar").src =
    user.avatar || "/static/img/default-avatar.png";

  document.getElementById("callName").innerText = user.name;
  document.getElementById("callStatus").innerText = "Calling...";
  document.getElementById("callTimer").innerText = "00:00";

  document.getElementById("callScreen").classList.remove("hidden");

  // Simula conexão
  setTimeout(() => {
    document.getElementById("callStatus").innerText = "Connected";
    startTimer();
  }, 2000);
}

function startTimer() {
  seconds = 0;
  callInterval = setInterval(() => {
    seconds++;
    const min = String(Math.floor(seconds / 60)).padStart(2, "0");
    const sec = String(seconds % 60).padStart(2, "0");
    document.getElementById("callTimer").innerText = `${min}:${sec}`;
  }, 1000);
}

function endCall() {
  clearInterval(callInterval);
  document.getElementById("callScreen").classList.add("hidden");
}

// ================================
// USER CARD
// ================================
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


///////////////////////////////////////////////
// ================================
// SEARCH & FILTER LOGIC
// ================================
let activeFilter = "all";
const searchInput = document.getElementById("searchInput");
const filterButtons = document.querySelectorAll(".filter");

// --- SEARCH ---
searchInput.addEventListener("input", applyFilters);

// --- FILTER BUTTONS ---
filterButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    filterButtons.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    applyFilters();
  });
});

// ================================
// APPLY FILTERS
// ================================
function applyFilters() {
  if (!window.usersCache) return;

  const query = searchInput.value.toLowerCase().trim();

  const filteredUsers = window.usersCache.filter(user => {
    // ---------- SEARCH ----------
    const matchesSearch =
      user.name?.toLowerCase().includes(query) ||
      user.country?.toLowerCase().includes(query) ||
      user.interests?.some(i => i.toLowerCase().includes(query));

    // ---------- FILTERS ----------
    let matchesFilter = true;

    switch (activeFilter) {
      case "native":
      case "beginner":
      case "intermediate":
      case "advanced":
        matchesFilter = user.level === activeFilter;
        break;

      case "available":
        matchesFilter = user.online === true;
        break;

      case "similar":
        matchesFilter = hasSimilarInterests(user);
        break;

      case "all":
      default:
        matchesFilter = true;
    }

    return matchesSearch && matchesFilter;
  });

  renderUsers(filteredUsers);
}

// ================================
// RENDER USERS
// ================================
function renderUsers(users) {
  const container = document.getElementById("usersList");
  container.innerHTML = "";

  if (users.length === 0) {
    container.innerHTML = `
      <p style="opacity:.6; text-align:center; padding:2rem">
        No users found
      </p>`;
    return;
  }

  users.forEach(user => {
    container.innerHTML += createUserCard(user);
  });
}

// ================================
// SIMILAR INTERESTS (LOGGED USER)
// ================================
function hasSimilarInterests(user) {
  const loggedUser =
    JSON.parse(localStorage.getItem("loggedUser")) || null;

  if (!loggedUser || !loggedUser.interests) return false;

  return user.interests?.some(i =>
    loggedUser.interests.includes(i)
  );
}

tempUser.online = true;
