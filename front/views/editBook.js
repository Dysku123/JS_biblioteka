import { apiFetch } from "../api/apiFetch.js";
import { pokazKomunikat, escapeHTML } from "../ui.js";
import { KATEGORIE } from "../kategorie.js";

window.zapiszZmiany = async (event, id) => {
  event.preventDefault();
  const body = {
    author: document.getElementById("edit-author").value,
    category: document.getElementById("edit-category").value,
    publishedDate: Number(document.getElementById("edit-publishedDate").value),
    pages: Number(document.getElementById("edit-pages").value),
  };
  const teraz = new Date().getFullYear();
  if (body.publishedDate > teraz || body.publishedDate < 0) {
    pokazKomunikat(`Rok wydania musi być z przedziału 0–${teraz}`, "blad");
    return;
  }
  try {
    const data = await apiFetch(`/book/${id}`, {
      method: "PUT",
      body: JSON.stringify(body),
    });
    pokazKomunikat(data.message, "sukces");
    setTimeout(() => (location.hash = `/books/${id}`), 1000); // wracamy na szczegóły
  } catch (err) {
    pokazKomunikat(err.message, "blad");
  }
};

export const renderEditBook = async (id) => {
  try {
    const data = await apiFetch(`/book/${id}`);
    const ksiazka = data.book;

    const opcjeKat = KATEGORIE.map(
      (k) =>
        `<option value="${k}" ${k === ksiazka.category ? "selected" : ""}>${k}</option>`,
    ).join("");

    return `
      <section class="widok-formularz">
        <div id="komunikat" class="komunikat"></div>
        <h2>Edytuj książkę</h2>
        <form onsubmit="zapiszZmiany(event, '${id}')">
          <div class="pole">
            <label for="edit-title">Tytuł (nie można zmienić)</label>
            <input id="edit-title" value="${escapeHTML(ksiazka.title)}" disabled />
          </div>
          <div class="pole">
            <label for="edit-category">Kategoria</label>
            <select id="edit-category" required>${opcjeKat}</select>
          </div>
          <div class="pole">
            <label for="edit-author">Autor</label>
            <input id="edit-author" value="${escapeHTML(ksiazka.author)}" required />
          </div>
          <div class="pole">
            <label for="edit-publishedDate">Rok wydania</label>
            <input id="edit-publishedDate" type="number" min="0" max="${new Date().getFullYear()}" value="${escapeHTML(ksiazka.publishedDate)}" required />
          </div>
          <div class="pole">
            <label for="edit-pages">Liczba stron</label>
            <input id="edit-pages" type="number" min="1" value="${escapeHTML(ksiazka.pages)}" required />
          </div>
          <button type="submit">Zapisz zmiany</button>
        </form>
      </section>
    `;
  } catch (err) {
    return `<p class="blad">Nie udało się wczytać książki: ${err.message}</p>`;
  }
};
