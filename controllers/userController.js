const { returnAllUsers, updateUserRole } = require("../services/UserService");

const getAllUsers = async (req, res, next) => {
  try {
    const user = await returnAllUsers();
    res.json(user);
  } catch (err) {
    next(err);
  }
};

const changeUserRole = async (req, res, next) => {
  const allowedRoles = ["user", "admin", "librarian"];
  const { userId } = req.params; // Pobieramy ID z adresu URL (zgodnie z routingiem)
  const { newRole } = req.body;

  if (!allowedRoles.includes(newRole)) {
    return next(new AppError("nieprawidłowa rola", 400));
  }

  try {
    const user = await updateUserRole(userId, newRole);
    if (!user) {
      return next(new AppError("użytkownik nie istnieje", 404));
    }
    res.status(200).json({ message: "Rola została zaktualizowana", user });
  } catch (err) {
    next(err);
  }
};

const deleteUseID = async (req, res, next) => {
  const { userId } = req.params;
  const profileId = req.user.userId;
  if (userId === profileId) {
    return next(new AppError("nie można usunąć własnego konta", 403));
  }
  try {
    const userUSer = await finduserById(userId);
    if (!userUSer) {
      return next(new AppError("użytkownik nie istnieje", 404));
    }
    await deleteUser(userId);
    res.status(200).json({ message: "użytkownik został usunięty" });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllUsers,
  changeUserRole,
  deleteUserID,
};
