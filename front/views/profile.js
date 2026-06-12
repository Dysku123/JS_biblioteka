import { apiFetch } from "../api/apiFetch.js";
import { pokazKomunikat, escapeHTML } from "../ui.js";

window.zmienEmail = async (event) => {
  event.preventDefault();
  const nowy = document.getElementById("nowy-email").value;
  try {
    const data = await apiFetch("/profile/email", {
      method: "PATCH",
      body: JSON.stringify({ email: nowy }),
    });
    pokazKomunikat(data.message, "sukces");
    setTimeout(() => window.router(), 1000);
  } catch (err) {
    pokazKomunikat(err.message, "blad");
  }
};

window.usunKonto = async () => {
  const haslo = document.getElementById("usun-haslo").value;
  if (!haslo) {
    pokazKomunikat("Podaj hasło, aby usunąć konto", "blad");
    return;
  }
  if (!confirm("Na pewno usunąć konto? Tej operacji nie można cofnąć.")) return;
  try {
    await apiFetch("/profile/delete", {
      method: "DELETE",
      body: JSON.stringify({ password: haslo }),
    });
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    location.hash = "/register";
  } catch (err) {
    pokazKomunikat(err.message, "blad"); 
  }
};

export const renderProfile = async (user) => {
  let mojeHtml = "";
  try {
    const data = await apiFetch("/profile/mybooks");
    const mybooks = data.mybooks;

    if (mybooks.length === 0) {
      mojeHtml = "<p>Brak wypożyczeń.</p>";
    } else {
      let wiersze = "";
      for (const w of mybooks) {
        let tytul = w.bookId;
        try {
          const b = await apiFetch(`/book/${w.bookId}`);
          tytul = b.book.title;
        } catch (e) {
        }
        let pozostalo = "—";
        if (w.isOpen) {
          pozostalo =
            w.daysLeft < 0
              ? `SPÓŹNIONA o ${Math.abs(w.daysLeft)} dni`
              : `${w.daysLeft} dni`;
        }
        wiersze += `
          <tr>
            <td>${escapeHTML(tytul)}</td>
            <td>${new Date(w.borrowedAt).toLocaleDateString("pl-PL")}</td>
            <td>${new Date(w.dueDate).toLocaleDateString("pl-PL")}</td>
            <td>${pozostalo}</td>
            <td>${w.isOpen ? "wypożyczona" : "zwrócona"}</td>
          </tr>`;
      }
      mojeHtml = `
        <table border="1" class="tabela-wypozyczen">
            <thead>
                <tr><th>Tytuł</th><th>Data wypożyczenia</th><th>Termin zwrotu</th><th>Pozostało</th><th>Status</th></tr>
            </thead>
            <tbody>${wiersze}</tbody>
        </table>`;
    }
  } catch (err) {
    mojeHtml = `<p class="blad">Nie udało się pobrać wypożyczeń: ${err.message}</p>`;
  }

  return `
    <section class="widok-profil">
      <div id="komunikat" class="komunikat"></div>
      <h2>Mój profil</h2>
      <p><strong>Email:</strong> ${escapeHTML(user.email)}</p>
      <p><strong>Rola:</strong> ${escapeHTML(user.role)}</p>

      <h3>Zmień email</h3>
      <form onsubmit="zmienEmail(event)">
        <div class="pole">
          <label for="nowy-email">Nowy email</label>
          <input type="email" id="nowy-email" placeholder="nowy@email.com" required />
        </div>
        <button type="submit">Zmień email</button>
      </form>

      <h3>Moje wypożyczenia</h3>
      ${mojeHtml}

      <h3>Usuń konto</h3>
      <div class="pole">
        <label for="usun-haslo">Potwierdź hasłem</label>
        <input type="password" id="usun-haslo" placeholder="Twoje hasło" />
      </div>
      <button onclick="usunKonto()" class="btn-danger">Usuń konto</button>
    </section>
  `;
};
