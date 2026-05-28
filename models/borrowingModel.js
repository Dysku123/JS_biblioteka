const { borrowingsCollection } = require("../config/db");

const registerBorrowing = async (userId, title, dueDate, borrowedAmount) => {
  await borrowingsCollection.insertOne({
    userId,
    title,
    borrowedAt: new Date(),
    dueDate,
    returnedAt: null,
    borrowedAmount,
    returnedAmount: 0,
  });
};

const fetchBorrowingsByUserId = async (userId) => {
  return await borrowingsCollection.find({ userId }).toArray();
};

const registerReturn = async (userId, title) => {
  await borrowingsCollection.updateOne(
    {
      userId: userId,
      title: title,
      borrowedAmount: { $gt: 0 },
      returnedAt: null,
    },
    { $inc: { returnedAmount: 1 } },
  );
};

const findBorrowedBooks = async (userId, title) => {
  return await borrowingsCollection.findOne(
    {
    userId: userId,
    title: title,
    returnedAt: null
  });
};

module.exports = {
  registerBorrowing,
  fetchBorrowingsByUserId,
  registerReturn,
  findBorrowedBooks
};
