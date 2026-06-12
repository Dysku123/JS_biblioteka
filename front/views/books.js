import { apiFetch } from "../api/apiFetch.js";
import { KATEGORIE } from "../kategorie.js";
import { escapeHTML } from "../ui.js";

let strona = 1;
let endpoint = "/book"; // "/book" = wszystkie, "/book/available" = dostępne
let stronicowanie = true; // czy pokazywać przyciski stron (przy wyszukiwaniu = false)
let listaUser = null;

const odswiez = async () => {
  await window.router();
};
window.zmienStrone = async (kierunek) => {
  strona = strona + kierunek;
  if (strona < 1) strona = 1;
  await odswiez();
};

window.pokazWszystkie = async () => {
  endpoint = "/book";
  strona = 1;
  stronicowanie = true;
  await odswiez();
};

window.pokazDostepne = async () => {
  endpoint = "/book/available";
  strona = 1;
  stronicowanie = true;
  await odswiez();
};

window.szukaj = async () => {
  const typ = document.getElementById("szukaj-typ").value;
  const tekst = document.getElementById("szukaj-pole").value.trim();
  if (!tekst) return;
  szukajZGlownej(typ, tekst); // jedno miejsce ustawia endpoint
  await odswiez();
};

window.szukajKategoria = async () => {
  const kat = document.getElementById("filtr-kategoria").value;
  if (!kat) return; //
  endpoint = `/book/category/${encodeURIComponent(kat)}`;
  stronicowanie = false;
  await odswiez();
};

window.usunKsiazke = async (id) => {
  if (!confirm("Na pewno usunąć tę książkę?")) return; // kliknął Anuluj -> nic nie robimy
  try {
    await apiFetch(`/book/${id}`, { method: "DELETE" });
    await odswiez(); // przeładuj listę - usuniętej książki już nie ma
  } catch (err) {
    alert(err.message);
  }
};

export const szukajZGlownej = (typ, tekst) => {
  if (typ === "title") {
    endpoint = `/book?title=${encodeURIComponent(tekst)}`; // tytuł = query, nie ścieżka
  } else {
    endpoint = `/book/${typ}/${encodeURIComponent(tekst)}`;
  }
  stronicowanie = false;
  strona = 1;
};

export const renderBooks = async (user) => {
  if (user !== undefined) listaUser = user; // z routera przychodzi user; z odswiez() - undefined, więc zostaje stary
  const staff =
    listaUser && (listaUser.role === "librarian" || listaUser.role === "admin");
  try {
    const url = stronicowanie
      ? `${endpoint}?page=${strona}&limit=10`
      : endpoint;
    const data = await apiFetch(url);
    const books = data.books;
    const brakNastepnej = books.length < 10; // mniej niż pełna strona = koniec
    const opcjeKat = KATEGORIE.map(
      (k) => `<option value="${k}">${k}</option>`,
    ).join("");

    const wiersze = books
      .map(
        (k) => `
          <tr>
            <td><a href="#/books/${k._id}">${escapeHTML(k.title)}</a></td>
            <td>${escapeHTML(k.author)}</td>
            <td>${escapeHTML(k.category)}</td>
            <td>${escapeHTML(k.publishedDate)}</td>
            <td>${escapeHTML(k.availableCopies)}</td>
            ${staff ? `<td><a href="#/books/${k._id}/edit" class="btn-edytuj">Edytuj</a><button onclick="usunKsiazke('${k._id}')" class="btn-usun">Usuń</button></td>` : ""}
          </tr>`,
      )
      .join("");

    const paginacja = stronicowanie
      ? `
        <div class="paginacja">
          <button onclick="zmienStrone(-1)" ${strona === 1 ? "disabled" : ""}>← Poprzednia</button>
          <span class="paginacja-numer">Strona ${strona}</span>
          <button onclick="zmienStrone(1)" ${brakNastepnej ? "disabled" : ""}>Następna →</button>
        </div>`
      : "";

    return `
      <section class="widok-ksiazki">
        <h2>Lista książek</h2>

        <div class="zakladki">
            <button onclick="location.hash='/'">Główna</button>
            <button onclick="pokazWszystkie()">Wszystkie</button>
            <button onclick="pokazDostepne()">Dostępne</button>
        </div>

      <div class="wyszukiwarka">
          <select id="szukaj-typ">
            <option value="title">Tytuł</option>
            <option value="author">Autor</option>
            <option value="publishedDate">Rok</option>
          </select>
          <input id="szukaj-pole" placeholder="Szukaj..." />
          <button onclick="szukaj()">Szukaj</button>

          <select id="filtr-kategoria" onchange="szukajKategoria()">
            <option value="">-- Kategoria --</option>
            ${opcjeKat}
          </select>

          <button onclick="pokazWszystkie()">Wyczyść</button>
        </div>

        <table class="tabela-ksiazek" border="1">
            <thead>
                <tr>
                    <th>Tytuł</th>
                    <th>Autor</th>
                    <th>Kategoria</th>
                    <th>Rok wydania</th>
                    <th>Dostępne</th>
                    ${staff ? "<th>Akcje</th>" : ""}
                </tr>
            </thead>
            <tbody>
                ${wiersze}
            </tbody>
        </table>

        ${paginacja}
      </section>
    `;
  } catch (err) {
    return `<p class="blad">Nie udało się pobrać książek: ${err.message}</p>`;
  }
};
