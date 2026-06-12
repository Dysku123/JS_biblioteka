const { returnAllUsers, modifyUserRole, removeUser } = require("../services/UserService");
const { findUserById } = require("../models/userModel");
const AppError = require("../errors/AppError");
const { ObjectId } = require("mongodb");

const getAllUsers = async (req, res, next) => {
  try {
    const user = await returnAllUsers();
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

const updateUserRole = async (req, res, next) => {
  const allowedRoles = ["user", "admin", "librarian"];
  const { userId } = req.params;
  const { newRole } = req.body;
  const profileId = req.user.userId;

  if (!ObjectId.isValid(userId)) {
    return next(new AppError("Nieprawidłowy ID", 400));
  }

  if (userId === profileId) {
    return next(new AppError("nie można zmienić własnej roli", 403));
  }

  if (!allowedRoles.includes(newRole)) {
    return next(new AppError("nieprawidłowa rola", 400));
  }

  try {
    const user = await modifyUserRole(userId, newRole);
    if (!user) {
      return next(new AppError("użytkownik nie istnieje", 404));
    }
    res.status(200).json({ message: "Rola została zaktualizowana", user });
  } catch (err) {
    next(err);
  }
};

const deleteUser = async (req, res, next) => {
  const { userId } = req.params;
  const profileId = req.user.userId;

  if (!ObjectId.isValid(userId)) {
    return next(new AppError("Nieprawidłowy ID", 400));
  }

  if (userId === profileId) {
    return next(new AppError("nie można usunąć własnego konta", 403));
  }

  try {
    const existingUser = await findUserById(userId);
    if (!existingUser) {
      return next(new AppError("użytkownik nie istnieje", 404));
    }
    await removeUser(userId);
    res.status(200).json({ message: "użytkownik został usunięty" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  updateUserRole,
  deleteUser,
};