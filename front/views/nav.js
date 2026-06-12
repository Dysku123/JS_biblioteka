window.wyloguj = async () => {
  await fetch("http://localhost:3000/auth/logout", {
    method: "POST",
    credentials: "include",
  });
  location.hash = "/login";
};

export const renderNav = (user) => {
  let linki = `<a href="#/books">Książki</a>`; //bazowe wyjściowe dla każdego
  if (!user) {
    linki += `<a href="#/login">Zaloguj się</a> <a href="#/register">Zarejestruj się</a>`;
  } else {
    if (user.role === "librarian" || user.role === "admin") {
      linki += `<a href="#/books/add">Dodaj książkę</a> <a href="#/admin/borrowings">Wypożyczenia</a>`;
    }
    if (user.role === "admin") {
      linki += `<a href="#/admin/users">Użytkownicy</a>`;
    }
    linki += `<a href="#/profile">Mój profil</a> <button onclick="wyloguj()">Wyloguj</button>`;
  }

  return `
    <nav class="menu">
      <a href="#/" class="logo">📚 Nasza Biblioteka</a>
      <div class="menu-linki">${linki}</div>
    </nav>
  `;
};
