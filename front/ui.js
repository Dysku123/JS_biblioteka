export const pokazKomunikat = (tekst, typ) => {
  const box = document.getElementById("komunikat");
  if (!box) return;
  box.textContent = tekst;
  box.className = "komunikat " + typ;
};

export const escapeHTML = (str) => {
  if (str === null || str === undefined) return "";
  return String(str).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
  );
};