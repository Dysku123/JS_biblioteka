import { pokazKomunikat } from "../ui.js";

window.zarejestruj = async (event) => {
  event.preventDefault();
  const email = document.getElementById("register-email").value;
  const haslo = document.getElementById("register-haslo").value;

  try {
    const res = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: haslo }),
    });
    const data = await res.json();

    if (res.ok) {
      pokazKomunikat("Konto utworzone, możesz się zalogować", "sukces");
      setTimeout(() => (location.hash = "/login"), 1200);
    } else {
      pokazKomunikat(data.message, "blad");
    }
  } catch (err) {
    pokazKomunikat("Błąd połączenia z serwerem", "blad");
  }
};
export const renderRegister = () => {
  return `
    <section class="widok-register">
      <h2>rejestracja</h2>
      <div id="komunikat" class="komunikat"></div>
      <form onsubmit="zarejestruj(event)">
        <div class="pole">
          <label for="register-email">Email</label>
          <input type="email" id="register-email" placeholder="Email" required />
        </div>
        <div class="pole">
          <label for="register-haslo">Hasło (min. 7 znaków)</label>
          <input type="password" id="register-haslo" placeholder="Hasło" required minlength="7" />
        </div>
        <button type="submit">Zarejestruj się</button>
      </form>
    </section>
    <a href="#/login">Masz już konto? Zaloguj się</a>
  `;
};
