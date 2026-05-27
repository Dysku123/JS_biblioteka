const { fetchBorrowingsByUserId } = require("../models/borrowingModel");
const bcrypt = require("bcrypt");
const {
  findUserById,
  deleteUserById,
  updateEmailById,
  findEmailDuplicate,
} = require("../models/userModel");

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
    throw new Error("użytkownik nie istnieje");
  }

  return user;
};

const removeUserProfile = async (userId, providePassword) => {
  const user = await findUserById(userId, true);
  if (!user) {
    throw new Error("użytkownik nie istnieje");
  }

  const isPasswordValid = await bcrypt.compare(providePassword, user.password);
  if (!isPasswordValid) {
    throw new Error("niepoprawne hasło");
  }
  await deleteUserById(userId);
};

const changeUserEmail = async (userId, newEmail) => {
  const user = await findUserById(userId);

  if (!user) {
    throw new Error("użytkownik nie istnieje");
  }

  if (user.email === newEmail) {
    throw new Error("email taki sam");
  }
  const emailTaken = await findEmailDuplicate(newEmail, userId);
  if (emailTaken) {
    throw new Error("nie można zmienić adresu email");
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
