const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {
  login,
  register,
  refreshToken,
  logout
} = require("../controllers/authController");
const validateBody = require("../middleware/validateBody");
const rateLimit = require("express-rate-limit");

const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 5, 
  message: {
    message:
      "Zbyt wiele prób rejestracji z tego adresu IP. Spróbuj ponownie za 15 minut.",
  },
});

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required(),
});

router.post("/login", validateBody(loginSchema), login);
router.post("/register", registerLimiter, validateBody(registerSchema), register);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);

module.exports = router;
