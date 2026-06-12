require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const { poloczZBaza } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const bookRoutes = require("./routes/bookRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

//app.use(helmet());
console.log("DEBUG FRONTEND_URL:", process.env.FRONTEND_URL);
app.use(
  cors({
    origin: [
      "http://localhost",
      "http://127.0.0.1",
      "http://localhost:3000",
      "http://localhost:3001",
      "http://127.0.0.1:3001",
    ],
    credentials: true,
  }),
);
app.use(cookieParser());
app.use(express.json());

app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/book", bookRoutes);
app.use("/users", userRoutes);

app.get("/", (req, res) => {
  res.send("witaj na stronie głównej");
});

app.use((err, req, res, next) => {
  console.error(`error next ${err.message}`);
  res.status(err.statusCode || 500).json({
    message: err.message,
  });
});

poloczZBaza()
  .then(() => {
    app.listen(3000, () => {
      console.log("działa nasluchiwanie na porcie 3000");
    });
  })
  .catch((err) => {
    console.error("Krytyczny błąd: Nie udało się połączyć z bazą danych!", err);
  });
