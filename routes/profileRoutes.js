const express = require("express");
const router = express.Router();
const Joi = require("joi");
const {
  getProfile,
  updateEmail,
  deleteProfile,
  getMyBooks,
} = require("../controllers/profileController");
const { verifyToken } = require("../middleware/auth");
const validateBody = require("../middleware/validateBody");

// Schematy walidacji body (blokują m.in. NoSQL injection - wymuszają string)
const emailSchema = Joi.object({
  email: Joi.string().email().required(),
});

const deleteSchema = Joi.object({
  password: Joi.string().required(),
});

router.get("/", verifyToken, getProfile);

router.patch("/email", verifyToken, validateBody(emailSchema), updateEmail);

router.delete("/delete", verifyToken, validateBody(deleteSchema), deleteProfile);

router.get("/mybooks", verifyToken, getMyBooks);

module.exports = router;
