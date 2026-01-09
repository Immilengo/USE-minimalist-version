
let db;
let tempUser = { interests: [] };

// Abre IndexedDB
const request = indexedDB.open("use_app", 1);

request.onupgradeneeded = e => {
  db = e.target.result;
  db.createObjectStore("users", { keyPath: "email" });
};

request.onsuccess = e => db = e.target.result;

function switchView(id) {
  document.querySelectorAll(".card > div").forEach(v => v.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function showRegister() { switchView("registerView"); }
function showLogin() { switchView("loginView"); }
function showSelectLevel() { switchView("levelView"); }
function sair() {
  if (confirm("Tem a certeza que deseja sair?")) {
    window.location.href = "home.html";
  }
}


function nextStep(step) {

  if (step === "level") {
    const regName = document.getElementById("regName");
    const regEmail = document.getElementById("regEmail");
    const regPassword = document.getElementById("regPassword");

    // limpar erros
    document.getElementById("error-name").innerText = "";
    document.getElementById("error-email").innerText = "";
    document.getElementById("error-password").innerText = "";

    if (!regName.value || !regEmail.value || !regPassword.value) {
      alert("You must fill all labels");
      return;
    }

    if (!regEmail.value.includes("@") || !regEmail.value.includes(".")) {
      document.getElementById("error-email").innerText = "You must enter a valid email";
      return;
    }

    if (regPassword.value.length < 6) {
      document.getElementById("error-password").innerText = "Password must be at least 6 characters";
      return;
    }

    if (regName.value.length < 3) {
      document.getElementById("error-name").innerText = "Name must be at least 3 characters";
      return;
    }

    tempUser.name = regName.value;
    tempUser.email = regEmail.value;
    tempUser.password = regPassword.value;

    switchView("levelView");
  }

  // VALIDATION STEP: INTERESTS
  if (step === "interests") {
    if (!tempUser.level) {
      alert("You must choose a level");
      return;
    }
    switchView("interestsView");
  }
}


function selectLevel(level, el) {
  tempUser.level = level;

  document.querySelectorAll("#levelView .option").forEach(o => o.classList.remove("selected"));
  el.classList.add("selected");

}


function toggleInterest(el) {
  const value = el.innerText;
  el.classList.toggle("selected");

  if (tempUser.interests.includes(value)) {
    tempUser.interests = tempUser.interests.filter(i => i !== value);
  } else {
    tempUser.interests.push(value);
  }
}


function register() {
  if (tempUser.interests.length < 3) {
    alert("Select at least 3 interests");
    return;
  }

  const tx = db.transaction("users", "readonly");
  const store = tx.objectStore("users");
  const check = store.get(tempUser.email);

  check.onsuccess = () => {
    if (check.result) {
      alert("This email is already registered");
      return;
    }

    const txWrite = db.transaction("users", "readwrite");
    const storeWrite = txWrite.objectStore("users");

    tempUser.online = true;
    tempUser.avatar = "/static/img/default-avatar.png";

    storeWrite.add(tempUser);

    txWrite.oncomplete = () => {
      alert("Account created!");
      switchView("loginView");
      location.reload();
    };
  };
}

function login() {
  const loginEmail = document.getElementById("loginEmail");
  const loginPassword = document.getElementById("loginPassword");

  const emailError = document.getElementById("error-login-email");
  const passError = document.getElementById("error-login-password");

  // limpa erros
  emailError.innerText = "";
  passError.innerText = "";

  if (!loginEmail.value) emailError.innerText = "Email is required";
  if (!loginPassword.value) passError.innerText = "Password is required";
  if (!loginEmail.value || !loginPassword.value) return;

  const tx = db.transaction("users", "readonly");
  const req = tx.objectStore("users").get(loginEmail.value);

  req.onsuccess = () => {
    const user = req.result;

    if (!user || user.password !== loginPassword.value) {
      alert("Invalid credentials");
      return;
    }

    localStorage.setItem("loggedUser", JSON.stringify({
      name: user.name,
      email: user.email,
      level: user.level,
      interests: user.interests,
      online: true,
      avatar: user.avatar
    }));

    window.location.href = "/html/index.html";
  };
}
