import { apiFetch } from "../api/apiFetch.js";
import { escapeHTML } from "../ui.js";

let stronaW = 1; // numer strony wypożyczeń

window.zmienStroneW = async (kierunek) => {
  stronaW = stronaW + kierunek;
  if (stronaW < 1) stronaW = 1;
  window.router(); // przeładuj cały widok (z menu)
};

export const renderBorrowings = async () => {
  try {
    const data = await apiFetch(`/book/borrowings?page=${stronaW}&limit=10`);
    const borrowings = data.borrowings;
    const brakNastepnej = borrowings.length < 10;

    let wiersze = "";
    for (const b of borrowings) {
      wiersze += `
        <tr>
          <td>${escapeHTML(b.bookTitle || b.bookId)}</td>
          <td>${b.userId}</td>
          <td>${escapeHTML(b.userEmail || "—")}</td>
          <td>${new Date(b.borrowedAt).toLocaleDateString("pl-PL")}</td>
          <td>${new Date(b.dueDate).toLocaleDateString("pl-PL")}</td>
          <td>${b.borrowedAmount}</td>
          <td>${b.returnedAmount}</td>
          <td>${b.isOpen ? "otwarte" : "zamknięte"}</td>
        </tr>`;
    }

    return `
      <section class="widok-wypozyczenia">
        <h2>Wszystkie wypożyczenia</h2>
        <table border="1" class="tabela-wszystkich-wypozyczen">
          <thead>
             <tr>
              <th>Książka</th>
              <th>Użytkownik (ID)</th>
              <th>Email</th>
              <th>Data wypożyczenia</th>
              <th>Termin zwrotu</th>
              <th>Wypożyczono</th>
              <th>Zwrócono</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            ${wiersze || `<tr><td colspan="8">Brak wypożyczeń.</td></tr>`}
          </tbody>
        </table>
        <div class="paginacja">
          <button onclick="zmienStroneW(-1)" ${stronaW === 1 ? "disabled" : ""}>← Poprzednia</button>
          <span class="paginacja-numer">Strona ${stronaW}</span>
          <button onclick="zmienStroneW(1)" ${brakNastepnej ? "disabled" : ""}>Następna →</button>
        </div>
      </section>
    `;
  } catch (err) {
    return `<p class="blad">Nie udało się pobrać wypożyczeń: ${err.message}</p>`;
  }
};
