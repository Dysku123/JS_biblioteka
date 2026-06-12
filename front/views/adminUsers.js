import { apiFetch } from "../api/apiFetch.js";
import { pokazKomunikat, escapeHTML } from "../ui.js";

const ROLE = ["user", "librarian", "admin"];

window.zmienRole = async (id) => {
  const nowa = document.getElementById(`rola-${id}`).value;
  try {
    const data = await apiFetch(`/users/${id}/role`, {
      method: "PUT",
      body: JSON.stringify({ newRole: nowa }),
    });
    pokazKomunikat(data.message, "sukces");
  } catch (err) {
    pokazKomunikat(err.message, "blad");
  }
};

window.usunUzytkownika = async (id) => {
  if (!confirm("Na pewno usunąć tego użytkownika?")) return;
  try {
    await apiFetch(`/users/${id}`, { method: "DELETE" });
    window.router(); // przeładuj listę - użytkownika już nie ma
  } catch (err) {
    pokazKomunikat(err.message, "blad");
  }
};

export const renderAdminUsers = async (user) => {
  try {
    const users = await apiFetch("/users"); // tablica użytkowników

    let wiersze = "";
    for (const u of users) {
      const opcje = ROLE.map(
        (r) =>
          `<option value="${r}" ${r === u.role ? "selected" : ""}>${r}</option>`,
      ).join("");
      const toJa = String(u._id) === String(user._id); // siebie nie usuwamy

      wiersze += `
        <tr>
          <td>${escapeHTML(u.email)}</td>
           <td>
            <select id="rola-${u._id}" ${toJa ? "disabled" : ""}>${opcje}</select>
            <button onclick="zmienRole('${u._id}')" ${toJa ? "disabled" : ""}>Zapisz</button>
          </td>
          <td>
            <button onclick="usunUzytkownika('${u._id}')" class="btn-usun" ${toJa ? "disabled" : ""}>Usuń</button>
          </td>
        </tr>`;
    }

    return `
      <section class="widok-admin-users">
        <div id="komunikat" class="komunikat"></div>
        <h2>Użytkownicy</h2>
        <table border="1" class="tabela-uzytkownikow">
          <thead>
            <tr><th>Email</th><th>Rola</th><th>Akcje</th></tr>
          </thead>
          <tbody>${wiersze}</tbody>
        </table>
      </section>
    `;
  } catch (err) {
    return `<p class="blad">Nie udało się pobrać użytkowników: ${err.message}</p>`;
  }
};
