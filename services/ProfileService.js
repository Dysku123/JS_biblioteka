const { fetchBorrowingsByUserId } = require("../models/borrowingModel");
const bcrypt = require("bcrypt");
const {
  findUserById,
  deleteUserById,
  updateEmailById,
  findEmailDuplicate,
} = require("../models/userModel");
const AppError = require("../errors/AppError");

const getUserProfileBooks = async (userId) => {
  const books = await fetchBorrowingsByUserId(userId);

  const date = new Date();

  const processedBooks = books.map((book) => {
    const dateDiff = book.dueDate - date;

    const daysLeft = Math.ceil(dateDiff / (1000 * 60 * 60 * 24)); //zmieniamy milisekndy na normalne dni

    return {
      ...book,
      daysLeft: daysLeft,
    };
  });

  return processedBooks;
};

const getUserProfileData = async (userId) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("użytkownik nie istnieje", 404);
  }

  return user;
};

const removeUserProfile = async (userId, providePassword) => {
  const user = await findUserById(userId, true);
  if (!user) {
    throw new AppError("użytkownik nie istnieje", 404);
  }

  const isPasswordValid = await bcrypt.compare(providePassword, user.password);
  if (!isPasswordValid) {
    throw new AppError("niepoprawne hasło", 400);
  }
  await deleteUserById(userId);
};

const changeUserEmail = async (userId, newEmail) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new AppError("użytkownik nie istnieje", 404);
  }

  if (user.email === newEmail) {
    throw new AppError("email taki sam", 400);
  }
  const emailTaken = await findEmailDuplicate(newEmail, userId);
  if (emailTaken) {
    throw new AppError("nie można zmienić adresu email", 400);
  }

  await updateEmailById(userId, newEmail);

  return user;
};

module.exports = {
  getUserProfileBooks,
  getUserProfileData,
  removeUserProfile,
  changeUserEmail,
};
