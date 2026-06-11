import { renderHome } from "./front/views/home.js";
const appDiv = document.getElementById("app");

const router = () => {
  const path = window.location.pathname;

  const routes = [{ path: "/", view: renderHome }];

  const route = routes.find((route) => route.path === path);

  if (route) {
    appDiv.innerHTML = route.view();
  } else {
    appDiv.innerHTML = renderHome();
  }
};

// Globalny nasłuchiwacz kliknięć
document.addEventListener("click", (event) => {
  // Szukamy najbliższego linku (<a>) w hierarchii DOM
  const targetLink = event.target.closest("a");

  if (targetLink) {
    // 1. Zablokuj domyślne przeładowanie strony
    event.preventDefault();

    // 2. Pobierz ścieżkę z linku i zmień adres URL bez przeładowania
    const path = targetLink.getAttribute("href");
    window.history.pushState(null, null, path);

    // 3. Wywołaj router ręcznie, aby zaktualizował widok
    router();
  }
});

document.addEventListener("DOMContentLoaded", () => {
  router();
});

document.addEventListener("submit", async (event) => {
  if (event.target.id === "search-form") {
    event.preventDefault();

    const title = event.target.querySelector("#search-input").value;

    try {
      // Wysyłamy zapytanie do serwera (zmień adres na swój, np. localhost:3000)
      const response = await fetch(
        `http://localhost:3000/book?title=${encodeURIComponent(title)}`,
      );

      if (!response.ok) throw new Error("Błąd sieci");

      const data = await response.json();
      console.log("Wyniki wyszukiwania:", data);

      // Tutaj w następnym kroku wstrzykniemy wyniki do HTML
    } catch (err) {
      console.error("Błąd:", err);
    }
  }
});
