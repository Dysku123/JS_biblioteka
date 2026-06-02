const form = document.querySelector("#login-form");

const handleLogin = async (event) => {
  event.preventDefault();
  const userData = Object.fromEntries(new FormData(event.target));

  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });

    const data = await response.json();
    console.log("Serwer odpowiedział:", data);

    // Zapis tokena do pamięci przeglądarki, jeśli istnieje
  } catch (err) {
    console.log("Błąd z frontendu:", err.message);
  }
};

// Podpięcie referencji do funkcji (bez nawiasów!)
form.addEventListener("submit", handleLogin);

const registerForm = document.querySelector("#register-form");

const handleRegister = async (event) => {
  event.preventDefault();
  const userData = Object.fromEntries(new FormData(event.target));
  try {
    const response = await fetch("http://localhost:3000/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

registerForm.addEventListener("submit", handleRegister);

const fetchProfile = async () => {
  try {
    const response = await fetch("http://localhost:3000/profile", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await response.json();
    console.log("Dane profilu:", data);
  } catch (err) {
    console.log("Błąd podczas pobierania profilu:", err.message);
  }
};

document
  .querySelector("#fetch-profile")
  .addEventListener("click", fetchProfile);

const logoutBtn = document.querySelector("#logout-btn");

const handleLogout = async (event) => {
  try {
    const response = await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
  } catch (err) {
    console.log("Błąd podczas wylogowywania:", err.message);
  }
};

if (logoutBtn) {
  logoutBtn.addEventListener("click", handleLogout);
}

const updateEmailonFrontend = async (newEmailValue) => {
  try {
    const response = await fetch("http://localhost:3000/profile/email", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email: newEmailValue }),
    });
    const data = await response.json();
    console.log("Odpowiedź z serwera:", data);
  } catch (err) {
    console.log("Błąd podczas aktualizacji emaila:", err.message);
  }
};

const updateEmailBtn = document.querySelector("#update-email-btn");
const newEmailInput = document.querySelector("#new-email");

if (updateEmailBtn && newEmailInput) {
  updateEmailBtn.addEventListener("click", () => {
    updateEmailonFrontend(newEmailInput.value);
  });
}

const deleteProfileBtn = document.querySelector("#delete-profile-btn");
const passwordInput = document.querySelector("#password");
const passwordVerifyInput = document.querySelector("#password-verify");

const deleteProfileonFontend = async (passwordInput) => {
  try {
    const response = await fetch("http://localhost:3000/profile/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ password: passwordInput }),
    });
    const data = await response.json();
    console.log("Odpowiedź z serwera:", data);
  } catch (err) {
    console.log("Błąd podczas usuwania profilu:", err.message);
  }
};

if (deleteProfileBtn) {
  deleteProfileBtn.addEventListener("click", () => {
    const password = passwordInput.value;
    const passwordVerify = passwordVerifyInput.value;
    if (password === passwordVerify) {
      deleteProfileonFontend(password);
    } else {
      console.log("Hasła nie są takie same");
    }
  });
}
