const express = require("express");
const router = express.Router();
const { getAllUsers, getUserById, updateUserRole, deleteUser } = require("../controllers/userController");
const { verifyToken, isAdmin } = require("../middleware/auth");

router.put("/:userId/role", verifyToken, isAdmin, updateUserRole);
router.delete("/:userId", verifyToken, isAdmin, deleteUser);
router.get("/:userId", verifyToken, isAdmin, getUserById);
router.get("/", verifyToken, isAdmin, getAllUsers);

module.exports = router;