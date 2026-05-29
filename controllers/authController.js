const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
const { registerUser, loginUser } = require("../services/AuthService");

const login = async (req, res, next) => {
  const user_email = req.body.email;
  const user_password = req.body.password;
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
  try {
    await registerUser(user_email, user_password);
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

module.exports = {
  login,
  register,
};
