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
    });

    const data = await response.json();
    console.log("Serwer odpowiedział:", data);

    // Zapis tokena do pamięci przeglądarki, jeśli istnieje
    if (data.token) {
      localStorage.setItem("jwt_token", data.token);
    }
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
    });
    const data = await response.json();
    console.log(data);
  } catch (err) {
    console.log(err);
  }
};

registerForm.addEventListener("submit", handleRegister);

const fetchProfile = async () =>{
    const token = localStorage.getItem("jwt_token");
    if(!token){
        return console.log("Brak tokena, zaloguj się");
    }
    try{
        const response = await fetch("http://localhost:3000/profile", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });
        const data = await response.json();
        console.log("Dane profilu:", data);
    }catch(err){
        console.log("Błąd podczas pobierania profilu:", err.message);
    }
}

document.querySelector("#fetch-profile").addEventListener("click", fetchProfile);

const logoutBtn = document.querySelector("#logout-btn");

const handleLogout = (event) =>{
    localStorage.removeItem("jwt_token");
    console.log("Wylogowano");
}

if(logoutBtn){
    logoutBtn.addEventListener("click", handleLogout);
}

const updateEmailonFrontend = async (newEmailValue)=>{
  const token = localStorage.getItem("jwt_token");
  if (!token) {
    return console.log("Brak tokena, zaloguj się");
  }
  try{
    const response = await fetch ("http://localhost:3000/profile/email", {
      method: "PATCH",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({email: newEmailValue})
  });
  const data = await response.json();
  console.log("Odpowiedź z serwera:", data);
  }catch(err){
    console.log("Błąd podczas aktualizacji emaila:", err.message);
  }
};

const updateEmailBtn = document.querySelector("#update-email-btn");
const newEmailInput = document.querySelector("#new-email");

if(updateEmailBtn && newEmailInput){
    updateEmailBtn.addEventListener("click", () => {
        updateEmailonFrontend(newEmailInput.value);
    });
}

const deleteProfileBtn = document.querySelector("#delete-profile-btn");
const passwordInput = document.querySelector("#password");
const passwordVerifyInput = document.querySelector("#password-verify");

const deleteProfileonFontend = async (passwordInput)=>{
  const token = localStorage.getItem("jwt_token");
  if (!token) {
    return console.log("Brak tokena, zaloguj się");
  }
  try{
    const response = await fetch ("http://localhost:3000/profile/delete", {
      method: "DELETE",
      headers:{
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({password: passwordInput})
    });
    const data = await response.json();
    console.log("Odpowiedź z serwera:", data);
  }catch(err){
    console.log("Błąd podczas usuwania profilu:", err.message);
  }
}

if(deleteProfileBtn){
  deleteProfileBtn.addEventListener("click",() => {
    const password = passwordInput.value;
    const passwordVerify = passwordVerifyInput.value;
    if(password === passwordVerify){
      deleteProfileonFontend(password);
    }else{
      console.log("Hasła nie są takie same");
    }
  })
}