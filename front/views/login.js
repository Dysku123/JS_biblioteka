import { pokazKomunikat } from "../ui.js";

window.zaloguj = async (event) => {
  event.preventDefault();
  const email = document.getElementById("login-email").value;
  const haslo = document.getElementById("login-haslo").value;

  try {
    const res = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: haslo }),
    });
    const data = await res.json();

    if (res.ok) {
      pokazKomunikat("Zalogowano!", "sukces");
      setTimeout(() => (location.hash = "/books"), 1000); // chwila, żeby zobaczyć komunikat
    } else {
      pokazKomunikat(data.message, "blad");
    }
  } catch (err) {
    pokazKomunikat("Błąd połączenia z serwerem", "blad");
  }
};

export const renderLogin = () => {
  return `
    <section class="widok-login">
      <h2>Logowanie</h2>
      <div id="komunikat" class="komunikat"></div>
      <form onsubmit="zaloguj(event)">
        <div class="pole">
          <label for="login-email">Email</label>
          <input type="email" id="login-email" placeholder="Email" required />
        </div>
        <div class="pole">
          <label for="login-haslo">Hasło</label>
          <input type="password" id="login-haslo" placeholder="Hasło" required />
        </div>
        <button type="submit">Zaloguj się</button>
      </form>
      <a href="#/register">Nie masz konta? Zarejestruj się</a>
    </section>
  `;
};
