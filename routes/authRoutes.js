const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { login, register } = require("../controllers/authController");
const validateBody = require("../middleware/validateBody");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required(),
});

router.post("/login", validateBody(loginSchema), login);
router.post("/register", validateBody(registerSchema), register);

module.exports = router;

