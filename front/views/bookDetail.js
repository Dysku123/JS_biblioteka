import { apiFetch } from "../api/apiFetch.js";
import { pokazKomunikat, escapeHTML } from "../ui.js";

// wypożyczenie (globalne, bo onclick)
window.wypozycz = async (id) => {
  const pole = document.getElementById("ile-egz");
  let ile = Number(pole.value);
  const max = Number(pole.max); // tyle ile jest na stanie
  if (ile > max) ile = max;
  if (ile < 1) ile = 1;
  try {
    const data = await apiFetch(`/book/${id}/borrow`, {
      method: "POST",
      body: JSON.stringify({ amount: ile }),
    });
    pokazKomunikat(data.message, "sukces");
  } catch (err) {
    pokazKomunikat(err.message, "blad");
  }
  // chwila na przeczytanie komunikatu, potem przeładowanie ze świeżym stanem
  setTimeout(() => window.router(), 1000);
};

// zwrot
window.zwroc = async (id) => {
  try {
    const data = await apiFetch(`/book/${id}/return`, {
      method: "POST",
      body: JSON.stringify({}),
    });
    pokazKomunikat(data.message, "sukces");
  } catch (err) {
    pokazKomunikat(err.message, "blad");
  }
  setTimeout(() => window.router(), 1000);
};

export const renderBookDetail = async (id, user) => {
  try {
    const data = await apiFetch(`/book/${id}`);
    const k = data.book;

    // Czy zalogowany user ma tę książkę aktualnie wypożyczoną? (decyduje o guziku "Zwróć")
    let maWypozyczona = false;
    if (user) {
      try {
        const moje = await apiFetch("/profile/mybooks");
        maWypozyczona = moje.mybooks.some(
          (w) => String(w.bookId) === String(id) && w.isOpen,
        );
      } catch (err) {
        // brak danych o wypożyczeniach - zostaje false
      }
    }

    // Przyciski tylko dla zalogowanych
    let akcje = "";
    if (user) {
      const brakEgz = k.availableCopies === 0;
      akcje = `
        <div class="wypozyczenie">
          <label>Ile egzemplarzy:
            <input type="number" id="ile-egz" min="1" max="${k.availableCopies}" value="1" ${brakEgz ? "disabled" : ""} />
          </label>
          <button onclick="wypozycz('${id}')" ${brakEgz ? "disabled" : ""}>
            ${brakEgz ? "Brak dostępnych egzemplarzy" : "Wypożycz"}
          </button>
          <button onclick="zwroc('${id}')" ${maWypozyczona ? "" : "disabled"}>
            ${maWypozyczona ? "Zwróć" : "Brak kopii do zwrotu"}
          </button>
        </div>`;
    }

    return `
      <section class="widok-ksiazka">
        <div id="komunikat" class="komunikat"></div>
        <a href="#/books">← Powrót do listy</a>
        <h2>${escapeHTML(k.title)}</h2>
        <p>Autor: ${escapeHTML(k.author)}</p>
        <p>Kategoria: ${escapeHTML(k.category)}</p>
        <p>Rok wydania: ${escapeHTML(k.publishedDate)}</p>
        <p>Liczba stron: ${escapeHTML(k.pages)}</p>
        <p>Dostępne: ${escapeHTML(k.availableCopies)} / ${escapeHTML(k.totalCopies)}</p>
        ${akcje}
      </section>
    `;
  } catch (err) {
    return `<p class="blad">Nie udało się wczytać książki: ${err.message}</p>`;
  }
};
