// Carregar usuário do localStorage ou criar padrão
let user = JSON.parse(localStorage.getItem("loggedUser")) || {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    level: "beginner",
    avatar: "",
    interests: ["English"],
    avgMinutes: 30,
    rating: 4.5
  };
  
  // Elementos do DOM
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const levelSelect = document.getElementById("level");
  const avatarInput = document.getElementById("avatarUrl");
  const interestsInput = document.getElementById("interests");
  const avgMinutesInput = document.getElementById("avgMinutes");
  const ratingInput = document.getElementById("rating");
  
  const avatarPreview = document.getElementById("profileAvatar");
  const sidebarAvatar = document.getElementById("sidebarAvatar");
  
  // Atualiza campos do formulário
  function updateForm() {
    nameInput.value = user.name;
    emailInput.value = user.email;
    levelSelect.value = user.level;
    avatarInput.value = user.avatar || "";
    interestsInput.value = user.interests.join(", ");
    avgMinutesInput.value = user.avgMinutes;
    ratingInput.value = user.rating;
  
    avatarPreview.textContent = user.name.charAt(0).toUpperCase();
    sidebarAvatar.textContent = user.name.charAt(0).toUpperCase();
  }
  
  updateForm();
  
  // Salvar alterações
  document.getElementById("profileForm").onsubmit = (e) => {
    e.preventDefault();
  
    user.name = nameInput.value.trim();
    user.email = emailInput.value.trim();
    user.level = levelSelect.value;
    user.avatar = avatarInput.value.trim();
    user.interests = interestsInput.value.split(",").map(i => i.trim()).filter(Boolean);
    user.avgMinutes = Number(avgMinutesInput.value);
    user.rating = Number(ratingInput.value);
  
    localStorage.setItem("loggedUser", JSON.stringify(user));
  
    updateForm();
    alert("Profile updated successfully!");
  };
  