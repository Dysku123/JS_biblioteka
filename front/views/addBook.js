import { apiFetch } from "../api/apiFetch.js";
import { pokazKomunikat } from "../ui.js";
import { KATEGORIE } from "../kategorie.js";

window.dodajKsiazke = async (event) => {
  event.preventDefault();
  const body = {
    title: document.getElementById("dodaj-title").value,
    author: document.getElementById("dodaj-author").value,
    category: document.getElementById("dodaj-category").value,
    publishedDate: Number(document.getElementById("dodaj-publishedDate").value),
    pages: Number(document.getElementById("dodaj-pages").value),
    totalCopies: Number(document.getElementById("dodaj-totalCopies").value),
  };
  const teraz = new Date().getFullYear();
  if (body.publishedDate > teraz || body.publishedDate < 0) {
    pokazKomunikat(`Rok wydania musi być z przedziału 0–${teraz}`, "blad");
    return; // nie wysyłamy do backendu
  }
  try {
    const data = await apiFetch("/book/add", {
      method: "POST",
      body: JSON.stringify(body),
    });
    pokazKomunikat(data.message, "sukces");
    setTimeout(() => (location.hash = "/books"), 1000);
  } catch (err) {
    pokazKomunikat(err.message, "blad");
  }
};

export const renderAddBook = () => {
  const opcjeKat = KATEGORIE.map(
    (k) => `<option value="${k}">${k}</option>`,
  ).join("");
  return `
    <section class="widok-formularz">
      <div id="komunikat" class="komunikat"></div>
      <h2>Dodaj książkę</h2>
      <form onsubmit="dodajKsiazke(event)">
        <div class="pole">
          <label for="dodaj-title">Tytuł</label>
          <input id="dodaj-title" placeholder="Tytuł" required />
        </div>
        <div class="pole">
          <label for="dodaj-author">Autor</label>
          <input id="dodaj-author" placeholder="Autor" required />
        </div>
        <div class="pole">
          <label for="dodaj-category">Kategoria</label>
          <select id="dodaj-category" required>
            <option value="">-- Wybierz kategorię --</option>
            ${opcjeKat}
          </select>
        </div>
        <div class="pole">
          <label for="dodaj-publishedDate">Rok wydania</label>
          <input id="dodaj-publishedDate" type="number" min="0" max="${new Date().getFullYear()}" placeholder="Rok wydania" required />
        </div>
        <div class="pole">
          <label for="dodaj-pages">Liczba stron</label>
          <input id="dodaj-pages" type="number" min="1" placeholder="Liczba stron" required />
        </div>
        <div class="pole">
          <label for="dodaj-totalCopies">Liczba egzemplarzy</label>
          <input id="dodaj-totalCopies" type="number" min="1" placeholder="Liczba egzemplarzy" required />
        </div>
        <button type="submit">Dodaj książkę</button>
      </form>
    </section>
  `;
};
