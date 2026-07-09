(function () {
  const DB_NAME = "use_app";
  const DB_VERSION = 1;

  const seedUsers = [
    {
      name: "Ana Souza",
      email: "ana@example.com",
      password: "123456",
      level: "beginner",
      interests: ["Music", "Travel", "Technology"],
      online: true,
      avatar: "",
      avgMinutes: 25,
      rating: 4.7,
      country: "Angola"
    },
    {
      name: "John Miller",
      email: "john@example.com",
      password: "123456",
      level: "intermediate",
      interests: ["Sports", "Movies", "Cooking"],
      online: true,
      avatar: "",
      avgMinutes: 32,
      rating: 4.5,
      country: "United States"
    },
    {
      name: "Maria Silva",
      email: "maria@example.com",
      password: "123456",
      level: "advanced",
      interests: ["Reading", "Design", "Business"],
      online: false,
      avatar: "",
      avgMinutes: 41,
      rating: 4.8,
      country: "Brazil"
    },
    {
      name: "Oliver Brown",
      email: "oliver@example.com",
      password: "123456",
      level: "native",
      interests: ["Games", "Science", "Travel"],
      online: true,
      avatar: "",
      avgMinutes: 28,
      rating: 4.9,
      country: "United Kingdom"
    }
  ];

  function ensureLocalStorage() {
    if (!localStorage.getItem("loggedUser") && !localStorage.getItem("use_demo_logged_out")) {
      localStorage.setItem("loggedUser", JSON.stringify({
        name: "Ana Souza",
        email: "ana@example.com",
        level: "beginner",
        interests: ["Music", "Travel", "Technology"],
        online: true,
        avatar: "",
        avgMinutes: 25,
        rating: 4.7,
        country: "Angola"
      }));
    }

    if (!localStorage.getItem("logged_user_email")) {
      localStorage.setItem("logged_user_email", "ana@example.com");
    }

    if (!localStorage.getItem("use_total_minutes")) {
      localStorage.setItem("use_total_minutes", "12");
    }

    if (!localStorage.getItem("dictionary")) {
      localStorage.setItem("dictionary", JSON.stringify([
        { word: "Improve", translation: "Melhorar" },
        { word: "Practice", translation: "Praticar" },
        { word: "Speak", translation: "Falar" }
      ]));
    }

    if (!localStorage.getItem("chats")) {
      localStorage.setItem("chats", JSON.stringify({
        "john@example.com": [
          { texto: "Hey! Ready to practice?", autor: "me", id: 1 },
          { texto: "Yes, let's go!", autor: "them", id: 2 }
        ]
      }));
    }
  }

  function seedIndexedDB() {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains("users")) {
        db.createObjectStore("users", { keyPath: "email" });
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      const tx = db.transaction("users", "readonly");
      const store = tx.objectStore("users");
      const countRequest = store.count();

      countRequest.onsuccess = () => {
        if (countRequest.result > 0) {
          db.close();
          return;
        }

        const writeTx = db.transaction("users", "readwrite");
        const writeStore = writeTx.objectStore("users");
        seedUsers.forEach(user => writeStore.put(user));
        writeTx.oncomplete = () => db.close();
      };
    };
  }

  function redirectRoot() {
    if (location.pathname === "/" || location.pathname.endsWith("/")) {
      location.replace("/html/home.html");
    }
  }

  ensureLocalStorage();
  seedIndexedDB();
  redirectRoot();
})();
