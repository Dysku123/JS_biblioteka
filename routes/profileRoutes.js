const express = require("express");
const router = express.Router();
const { getProfile, updateEmail, deleteProfile } = require("../controllers/profileController");
const {getMyBooks} = require("../controllers/profileController");
const verifyToken = require("../middleware/auth");

router.get("/", verifyToken, getProfile);

router.patch('/email', verifyToken, updateEmail);

router.delete("/delete", verifyToken, deleteProfile);

router.get("/mybooks", verifyToken, getMyBooks);

module.exports = router;