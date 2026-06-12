async function apiFetch(url, options = {}) {
  let response = await fetch(`http://localhost:3000${url}`, {
    ...options, //rozpakowuje options, czyli np method: "GET" i inne rzeczy ktore tam damy
    credentials: "include", // ciasteczka
    headers: { "Content-Type": "application/json", ...options.headers }, // dajemy mozliwosc nadpisania standardowego application/json na cos innego
  });

  if (response.status === 401) {
    // jezeli token wygasł wchodzi tutaj
    // Spróbuj odświeżyć token
    const refresh = await fetch("http://localhost:3000/auth/refresh-token", {
      method: "POST",
      credentials: "include",
    });
    if (refresh.ok) {
      // jezeli uda sie odswiezyc, znowu wchodzi na ten sam url
      // Ponów oryginalny request
      response = await fetch(`http://localhost:3000${url}`, {
        ...options,
        credentials: "include",
        headers: { "Content-Type": "application/json", ...options.headers },
      });
    }
  }
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Błąd zapytania do API");
  }

  return response.json();
}

export const getMe = async () => {
  try {
    const data = await apiFetch("/profile");
    return data.user;
  } catch (err) {
    return null;
  }
};
export { apiFetch };
