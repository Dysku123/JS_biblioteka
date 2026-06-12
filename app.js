import { renderHome } from "./front/views/home.js";
import { renderBooks } from "./front/views/books.js";
import { renderLogin } from "./front/views/login.js";
import { renderRegister } from "./front/views/register.js";
import { getMe } from "./front/api/apiFetch.js";
import { renderNav } from "./front/views/nav.js";
import { renderBookDetail } from "./front/views/bookDetail.js";
import { renderAddBook } from "./front/views/addBook.js";
import { renderEditBook } from "./front/views/editBook.js";
import { renderProfile } from "./front/views/profile.js";
import { renderAdminUsers } from "./front/views/adminUsers.js";
import { renderBorrowings } from "./front/views/borrowings.js";



const appDiv = document.getElementById("app");

const router = async () => {
  const sciezka = location.hash.slice(1) || "/"; //zmieniamy na taki na hashach, bo ten nie działa, nie na kawałki wyciąga z linku id
  const user = await getMe();

  if (sciezka === "/books/add") {
    if (!user || (user.role !== "librarian" && user.role !== "admin")) {
      //na froncie wychodiz, ze tez trzeba blokwoac dla normalnych
      location.hash = "/books";
      return;
    }

    appDiv.innerHTML = renderNav(user) + renderAddBook();
    return;
  }
  if (sciezka.startsWith("/books/") && sciezka.endsWith("/edit")) {
    if (!user || (user.role !== "librarian" && user.role !== "admin")) {
      location.hash = "/books";
      return;
    }
    const id = sciezka.split("/")[2];
    appDiv.innerHTML = renderNav(user) + (await renderEditBook(id));
    return;
  }

  if (sciezka.startsWith("/books/")) {
    const id = sciezka.split("/")[2];
    appDiv.innerHTML = renderNav(user) + (await renderBookDetail(id, user));
    return;
  }

  const routes = [
    { path: "/", view: renderHome },
    { path: "/login", view: renderLogin, dostep: "gosc" },
    { path: "/register", view: renderRegister, dostep: "gosc" },
    { path: "/books", view: renderBooks },
    { path: "/profile", view: renderProfile, dostep: "zalogowany" },
    { path: "/admin/users", view: renderAdminUsers, dostep: "admin" },
    { path: "/admin/borrowings", view: renderBorrowings, dostep: "staff" },

  ];

  const route = routes.find((r) => r.path === sciezka);
  if (route && route.dostep === "gosc" && user) {
    location.hash = "/books"; // zalogowany nie ma po co być na login/register
    return;
  }
  if (route && route.dostep === "zalogowany" && !user) {
    location.hash = "/login"; // niezalogowany -> na logowanie
    return;
  }
  if (
    route &&
    route.dostep === "staff" &&
    (!user || (user.role !== "librarian" && user.role !== "admin"))
  ) {
    location.hash = "/books";
    return;
  }
  if (route && route.dostep === "admin" && (!user || user.role !== "admin")) {
    location.hash = "/books";
    return;
  }
  const tresc = route ? await route.view(user) : await renderHome();

  appDiv.innerHTML = renderNav(user) + tresc; // menu zawsze na górze
};

window.router = router; // globalnie, żeby dało się przeładować widok (np. po wypożyczeniu)
window.addEventListener("hashchange", router);
window.addEventListener("DOMContentLoaded", router);
