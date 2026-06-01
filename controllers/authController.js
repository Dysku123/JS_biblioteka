const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
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
      SECRET_KEY,
      { expiresIn: "7d" },
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
    });

    return res.status(200).json({
      message: "zalogowano pomyslnie",
      token: token,
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

    // Jeśli w .env zdefiniowano maila admina i zgadza się on z mailem z formularza
    if (firstAdminEmail && user_email === firstAdminEmail) {
      assignedRole = "admin";
    }

    // Przekazujemy wyliczoną rolę do warstwy serwisu
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
    const decoded = jwt.verify(refreshToken, SECRET_KEY);
    const userId = decoded.userId;
    const role = decoded.role;
    const newToken = jwt.sign({ userId, role }, SECRET_KEY, {
      expiresIn: "15m",
    });
    res.status(200).json({
      token: newToken,
    });
  } catch (err) {
    return res.status(403).json({
      message: "Nieprawidłowy token odświeżania",
    });
  }
};

module.exports = {
  login,
  register,
  refreshToken,
};
