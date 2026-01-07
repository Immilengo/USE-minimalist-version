// index.js

// Dados iniciais de exemplo
const defaultPeople = [
    {
      id: 1,
      name: "Sarah Mitchell",
      country: "United States 🇺🇸",
      avatar: "https://i.pravatar.cc/150?img=1",
      status: "online",
      level: "native",
      interests: ["Technology", "Music"]
    },
    {
      id: 2,
      name: "Pedro Cavudissa",
      country: "Angola 🇦🇴",
      avatar: "https://i.pravatar.cc/150?img=2",
      status: "offline",
      level: "intermediate",
      interests: ["Sports", "Travel"]
    },
    {
      id: 3,
      name: "Anna Silva",
      country: "Brasil 🇧🇷",
      avatar: "https://i.pravatar.cc/150?img=3",
      status: "online",
      level: "beginner",
      interests: ["Movies", "Music"]
    }
  ];
  
  // Salva os dados no localStorage se ainda não existirem
  if (!localStorage.getItem("people")) {
    localStorage.setItem("people", JSON.stringify(defaultPeople));
  }
  
  // Função para carregar pessoas na tela
  function loadPeople() {
    const peopleGrid = document.getElementById("peopleGrid");
    peopleGrid.innerHTML = "";
  
    const people = JSON.parse(localStorage.getItem("people")) || [];
  
    people.forEach(person => {
      const card = document.createElement("div");
      card.className = `person-card ${person.level}`;
  
      card.innerHTML = `
        <span class="status ${person.status}"></span>
        <img src="${person.avatar}" alt="${person.name}">
        <h4>${person.name}</h4>
        <div class="country">${person.country}</div>
        <div class="level">${person.level.charAt(0).toUpperCase() + person.level.slice(1)}</div>
        <div class="topics">
          ${person.interests.map(i => `<span>${i}</span>`).join("")}
        </div>
        <button onclick="startChat(${person.id})">Conversar</button>
      `;
  
      peopleGrid.appendChild(card);
    });
  }
  
  // Função para iniciar chat (apenas exemplo)
  function startChat(userId) {
    const people = JSON.parse(localStorage.getItem("people")) || [];
    const user = people.find(p => p.id === userId);
    alert(`Iniciando chat com ${user.name}`);
  }
  
  // Filtrar pessoas por busca
  document.getElementById("searchInput").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const people = JSON.parse(localStorage.getItem("people")) || [];
    const filtered = people.filter(p => 
      p.name.toLowerCase().includes(query) ||
      p.country.toLowerCase().includes(query) ||
      p.interests.some(i => i.toLowerCase().includes(query))
    );
    localStorage.setItem("people", JSON.stringify(filtered.length ? filtered : people));
    loadPeople();
  });
  
  // Carrega pessoas na primeira vez
  loadPeople();
  