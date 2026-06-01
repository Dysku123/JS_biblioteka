const { borrowingsCollection } = require("../config/db");

const registerBorrowing = async (
  userId,
  title,
  dueDate,
  borrowedAmount,
  session,
) => {
  await borrowingsCollection.insertOne(
    {
      userId,
      title,
      borrowedAt: new Date(),
      dueDate,
      returnedAt: null,
      borrowedAmount,
      returnedAmount: 0,
    },
    { session: session },
  );
};

const fetchBorrowingsByUserId = async (userId) => {
  return await borrowingsCollection.find({ userId }).toArray();
};

const registerReturn = async (userId, title, session) => {
  await borrowingsCollection.updateOne(
    {
      userId: userId,
      title: title,
      borrowedAmount: { $gt: 0 },
      returnedAt: null,
    },
    { $inc: { returnedAmount: 1 } },
    { session: session },
  );
};

const findBorrowedBooks = async (userId, title, session) => {
  return await borrowingsCollection.findOne(
    {
      userId: userId,
      title: title,
      returnedAt: null,
    },
    { session: session },
  );
};

const closeBorrowing = async (userId, title, session) => {
  await borrowingsCollection.updateOne(
    { userId: userId, title: title, returnedAt: null },
    { $set: { returnedAt: new Date() } },
    { session: session },
  );
};

const fetchAllBorrowings = async (limit, skip) => {
  return await borrowingsCollection
    .find({
      returnedAt: null,
    })
    .skip(skip)
    .limit(limit)
    .toArray();
};
const hasOverdueBooks = async (userId) => {
  const now = new Date();
  const overdueBooks = await borrowingsCollection.findOne({
    userId: userId,
    returnedAt: null,
    dueDate: { $lt: now },
  });
  return overdueBooks;
}

module.exports = {
  registerBorrowing,
  fetchBorrowingsByUserId,
  registerReturn,
  findBorrowedBooks,
  closeBorrowing,
  fetchAllBorrowings,
  hasOverdueBooks
};
