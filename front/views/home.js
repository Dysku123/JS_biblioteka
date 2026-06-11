export const renderHome = () => {
  return `
    <div id="home-view">
      <nav>
        <ul>
          <li><a href="/books" data-link>Książki</a></li>
          <li><a href="/login" data-link>Zaloguj się</a></li>
          <li><a href="/register" data-link>Rejestracja</a></li>
        </ul>
      </nav>

      <main>
        <h1>Witaj w naszej Biblioteca 📚</h1>
        <form id="search-form">
          <input type="text" id="search-input" placeholder="Znajdź książkę..." required>
          <button type="submit">Szukaj 🔍</button>
        </form>
      </main>
    </div>
  `;
};