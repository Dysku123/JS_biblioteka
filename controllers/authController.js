const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const REFRESH_SECRET_KEY = process.env.REFRESH_SECRET_KEY;
const { registerUser, loginUser } = require("../services/AuthService");

const login = async (req, res, next) => {
  const user_email = req.body.email;
  const user_password = req.body.password;

  if (!user_email || !user_password) {
    return res.status(400).json({
      message: "Brak danych logowania",
    });
  }

  try {
    const user = await loginUser(user_email, user_password);

    const token = jwt.sign({ userId: user._id, role: user.role }, SECRET_KEY, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { userId: user._id, role: user.role },
      REFRESH_SECRET_KEY,
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false, // Ustawienie secure na true wymaga HTTPS
      sameSite: "strict", // Zapobiega wysyłaniu ciasteczka w żądaniach cross-site
    });
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });

    return res.status(200).json({
      message: "zalogowano pomyslnie",
    });
  } catch (err) {
    if (err.message === "Nieprawidłowe dane logowania") {
      return res.status(401).json({
        message: err.message,
      });
    }
    next(err);
  }
};

const register = async (req, res, next) => {
  const user_email = req.body.email;
  const user_password = req.body.password;

  if (!user_email || !user_password) {
    return res.status(400).json({
      message: "Brak danych rejestracji",
    });
  }

  try {
    const firstAdminEmail = process.env.FIRST_ADMIN_EMAIL;
    let assignedRole = "user"; // Domyślna rola dla każdego nowego konta

    if (firstAdminEmail && user_email === firstAdminEmail) {
      assignedRole = "admin";
    }

    await registerUser(user_email, user_password, assignedRole);

    res.status(201).json({
      message: "zarejestrowano pomyslnie",
    });
  } catch (err) {
    if (err.message === "Email jest już zarejestrowany") {
      return res.status(400).json({
        message: err.message,
      });
    }
    next(err);
  }
};

const refreshToken = (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({
      message: "Brak tokena odświeżania",
    });
  }
  try {
    const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
    const userId = decoded.userId;
    const role = decoded.role;
    const newToken = jwt.sign({ userId, role }, SECRET_KEY, {
      expiresIn: "15m",
    });
    res.cookie("accessToken", newToken, {
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    });
    res.status(200).json({
      message: "Token odświeżony pomyślnie",
    });
  } catch (err) {
    return res.status(403).json({
      message: "Nieprawidłowy token odświeżania",
    });
  }
};

const logout = (req, res, next) => {
  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");
  res.status(200).json({
    message: "Wylogowano pomyślnie",
  });
};


module.exports = {
  login,
  register,
  refreshToken,
  logout,
};
