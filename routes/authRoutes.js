const express = require("express");
const router = express.Router();
const Joi = require("joi");
const { login, register } = require("../controllers/authController");

const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(7).required(),
});

router.post("/login", login);
router.post("/register", validateBody(registerSchema), registerController);

module.exports = router;