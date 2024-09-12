let translations = {};
let availableLanguages = [];

function loadLanguage(lang) {
  return fetch(`/locales/${lang}.json`)
    .then((response) => response.json())
    .then((data) => {
      translations = data;
      applyTranslations();
    })
    .catch((error) => console.error("Error loading language file:", error));
}

function applyTranslations() {
  document.querySelector("h1").textContent =
    translations.title || "Default Title";
  document.getElementById("tab-to-transcribe").placeholder =
    translations.placeholder || "Type text here...";
  document.getElementById("read-button").textContent =
    translations.button || "Read";
  document.getElementById("transcribe-button").textContent =
    translations.transcribe || "Read";
}

export function translatePlaceholders(transcribedText) {
  let translatedText = transcribedText;

  for (const [key, value] of Object.entries(translations)) {
    const regex = new RegExp(`\\{${key}\\}`, "g");
    translatedText = translatedText.replace(regex, value);
  }

  return translatedText;
}

function fetchAvailableLanguages() {
  return fetch("/api/languages")
    .then((response) => response.json())
    .then((data) => {
      availableLanguages = data.languages;
      populateLanguageSelector();
      const userLang = getUserLanguage();
      loadLanguage(userLang);
    })
    .catch((error) =>
      console.error("Error fetching available languages:", error)
    );
}

function populateLanguageSelector() {
  const selector = document.getElementById("language-selector");
  selector.innerHTML = "";
  availableLanguages.forEach((lang) => {
    const option = document.createElement("option");
    option.value = lang;
    option.textContent = lang.charAt(0).toUpperCase() + lang.slice(1);
    selector.appendChild(option);
  });

  selector.addEventListener("change", (event) => {
    const selectedLang = event.target.value;
    loadLanguage(selectedLang);
  });
}

function getUserLanguage() {
  const userLang = navigator.language.slice(0, 2);
  return availableLanguages.includes(userLang) ? userLang : "en";
}

document.addEventListener("DOMContentLoaded", () => {
  fetchAvailableLanguages();
});

export function readLine(line) {
  if (line.trim() !== "") {
    const selectedLang =
      document.getElementById("language-selector").value || getUserLanguage();
    const utterance = new SpeechSynthesisUtterance(line);
    utterance.lang = selectedLang;
    speechSynthesis.speak(utterance);
  }
}
