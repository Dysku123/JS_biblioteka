const { MongoClient } = require("mongodb"); // zaciągamy mongo clienta, żeby się połączyć z bazą danych
const adresBazy = process.env.adresBazy; // pobieramy adres bazy danych z zmiennych środowiskowych
const client = new MongoClient(adresBazy);
const db = client.db("projekt_zaliczenie"); // wybieramy bazę
const usersCollection = db.collection("users"); // wybieramy kolekcję
const booksCollection = db.collection("books");
const borrowingsCollection = db.collection("borrowings");

async function poloczZBaza() {
  // async, bo czekamy, zanim polecimy dalej
  try {
    await client.connect(); //nawiazujemy polaczenie z db
    console.log("działa połaczenie z db");
    await usersCollection.createIndex({ email: 1 }, { unique: true });
    console.log("Indeks unikalności dla e-maila został ustawiony.");
  } catch (err) {
    console.log("nie dziala db", err);
  }
}
module.exports = {
  poloczZBaza,
  usersCollection,
  booksCollection,
  borrowingsCollection,
  client,
};
