//npm init - y - robi nam package.json, npm install express instaluje nam express. must have nas start
require("dotenv").config(); // zaciągamy dotenv, żeby mieć dostęp do zmiennych środowiskowych
const { poloczZBaza } = require("./config/db");
const express = require("express"); // zaciagamy express
const cors = require("cors"); //musimy to dodać, zeby fron przyjmował rzeczy z backu
const app = express(); // express to metoda, trzeba ją wywołać
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");

const cookieParser = require("cookie-parser");
app.use(
  cors({
    origin: "http://127.0.0.1:3001",
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json()); //dodajemy tłumaczenie jsona dla expresu, bez tego nic nie będzie działać
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/book", bookRoutes);
app.use("/users", userRoutes);


poloczZBaza()
  .then(() => {
    app.listen(3000, () => {
      //odpalamy nasłuchiwanie na porcie 3k
      console.log("działa nasluchiwanie na 3000");
    });
  })
  .catch((err) => {
    console.error("Krytyczny błąd: Nie udało się połączyć z bazą danych!", err);
  }); //wywolujemy poloczenie

app.get("/", (req, res) => {
  //robimy routing dla get dla głównej strony. req - co bierzemy, res - co oddajemy
  res.send("witaj na stronie głównej"); // komunikat na głównej
});

app.use((err, req, res, next) => {
  console.error(`error next ${err.message}`);
  res.status(err.statusCode || 500).json({
    message: err.message,
  });
});
