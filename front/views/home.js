import { szukajZGlownej } from "./books.js";

window.szukajGlowna = (event) => {
  event.preventDefault();
  const typ = document.getElementById("home-typ").value; // author / publishedDate
  const tekst = document.getElementById("home-pole").value.trim();
  if (!tekst) return;
  szukajZGlownej(typ, tekst); // ustaw stan listy książek
  location.hash = "/books"; // przejdź na listę -> router pokaże wyniki
};

export const renderHome = () => {
  return `
    <section class="widok-home">
      <h1>Witaj w naszej Bibliotece 📚</h1>
      <p>Wyszukaj książki i wypożycz je w kilka kliknięć.</p>
      <form id="search-form" onsubmit="szukajGlowna(event)">
        <select id="home-typ">
          <option value="title">Tytuł</option>
          <option value="author">Autor</option>
          <option value="publishedDate">Rok wydania</option>
        </select>
        <input type="text" id="home-pole" placeholder="Szukaj..." required />
        <button type="submit">Szukaj 🔍</button>
      </form>
      <a href="#/books">albo przeglądaj wszystkie książki →</a>
    </section>
  `;
};