const {
  findUserByEmail,
  createUser,
  findUserById,
  deleteUserById,
  updateEmailById,
  findEmailDuplicate,
} = require("../models/userModel");

const {
  getUserProfileBooks,
  getUserProfileData,
  removeUserProfile,
  changeUserEmail,
} = require("../services/profileService");

const getProfile = async (req, res, next) => {
  try {
    const user = await getUserProfileData(req.user.userId);
    return res.status(200).json({
      message: "dostęp przyznany",
      user,
    });
  } catch (err) {
    next(err);
  }
};

const updateEmail = async (req, res, next) => {
  try {
    const user = await changeUserEmail(req.user.userId, req.body.email);
    res.status(200).json({
      message: "email zaktualizowany",
    });
  } catch (err) {
    next(err);
  }
};

const deleteProfile = async (req, res, next) => {
  try {
    await removeUserProfile(req.user.userId, req.body.password);
    res.status(200).json({
      message: "profil usunięty",
    });
  } catch (err) {
    next(err);
  }
};

const getMyBooks = async (req, res, next) => {
  const userID = req.user.userId;
  try {
    const mybooks = await getUserProfileBooks(userID);
    res.status(200).json({
      message: "dostęp przyznany",
      mybooks,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfile,
  updateEmail,
  deleteProfile,
  getMyBooks,
};
