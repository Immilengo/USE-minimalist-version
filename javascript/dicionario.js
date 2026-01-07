// dictionary.js

let words = JSON.parse(localStorage.getItem("dictionary")) || [];

// DOM
const wordInput = document.getElementById("wordInput");
const translationInput = document.getElementById("translationInput");
const addWordBtn = document.getElementById("addWordBtn");
const translateBtn = document.getElementById("translateBtn");
const wordsList = document.getElementById("wordsList");

// Renderiza lista de palavras salvas
function renderWords() {
    wordsList.innerHTML = "";
    words.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `<strong>${item.word}</strong> → ${item.translation}
            <button class="delete-btn" onclick="deleteWord(${index})">✖</button>`;
        wordsList.appendChild(li);
    });
}

// Adiciona palavra manualmente
addWordBtn.addEventListener("click", () => {
    const word = wordInput.value.trim();
    const translation = translationInput.value.trim();

    if(!word || !translation) return alert("Please enter both word and translation.");

    words.push({ word, translation });
    localStorage.setItem("dictionary", JSON.stringify(words));
    wordInput.value = "";
    translationInput.value = "";
    renderWords();
});

// Deleta palavra
function deleteWord(index) {
    words.splice(index, 1);
    localStorage.setItem("dictionary", JSON.stringify(words));
    renderWords();
}

// Traduz palavra usando API LibreTranslate
translateBtn.addEventListener("click", async () => {
    const word = wordInput.value.trim();
    if(!word) return alert("Enter a word to translate.");

    try {
        const res = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=pt&dt=t&q=${encodeURIComponent(word)}`
        );
        const data = await res.json();
        // data[0][0][0] contém o texto traduzido
        translationInput.value = data[0][0][0];
    } catch (err) {
        console.error(err);
        alert("Translation failed. Try again.");
    }
});



// Inicializa
renderWords();
