let db;
let tempUser = { interests: [] };

const request = indexedDB.open("use_app", 1);

request.onupgradeneeded = e => {
  db = e.target.result;
  db.createObjectStore("users", { keyPath: "email" });
};

request.onsuccess = e => db = e.target.result;

function showRegister() {
  switchView("registerView");
}

function showLogin() {
  switchView("loginView");
}

function showSelectLevel() {
  switchView("levelView");
}


function nextStep(step) {
  if (step === "level") {
    if(!regName.value || !regEmail.value || !regPassword.value){
         alert("You must fill all labels");
         return;
    }
    tempUser.name = regName.value;
    tempUser.email = regEmail.value;
    tempUser.password = regPassword.value;
    switchView("levelView");
  }
  if (step === "interests") {
    if (!tempUser.level) {
      alert("You must choose a level");
      return;
    }
    switchView("interestsView");
  }
}

function selectLevel(level) {
  tempUser.level = level;
  document.querySelectorAll(".option").forEach(o => o.classList.remove("selected"));
  event.target.classList.add("selected");
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

  const tx = db.transaction("users", "readwrite");
  tx.objectStore("users").add(tempUser);

  tx.oncomplete = () =>{
    alert("Account created!");     
    switchView("loginView");
    location.reload();
  }

}

function login() {
  const tx = db.transaction("users", "readonly");
  const req = tx.objectStore("users").get(loginEmail.value);

  req.onsuccess = () => {
    if (!req.result || req.result.password !== loginPassword.value) {
      alert("Invalid credentials");
      return;
    }
    window.location.href="/html/index.html";
    alert("Welcome " + req.result.name);
  };
  window.location.href="index.html";
}

function switchView(id) {
  document.querySelectorAll(".card > div").forEach(v => v.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}
