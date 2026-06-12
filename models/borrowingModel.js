const { borrowingsCollection } = require("../config/db");
const { ObjectId } = require("mongodb");

const registerBorrowing = async (userId, bookId, dueDate, amount, session) => {
  await borrowingsCollection.insertOne(
    {
      userId: new ObjectId(userId),
      bookId: new ObjectId(bookId), // Zmiana: przechowujemy bookId zamiast title
      borrowedAt: new Date(),
      dueDate: dueDate,
      borrowedAmount: amount,
      returnedAmount: 0,
      isOpen: true,
    },
    { session }
  );
};

const findBorrowedBooks = async (userId, bookId, session) => {
  return await borrowingsCollection.findOne(
    {
      userId: new ObjectId(userId),
      bookId: new ObjectId(bookId),
      isOpen: true,
    },
    { session }
  );
};

const registerReturn = async (userId, bookId, session) => {
  await borrowingsCollection.updateOne(
    {
      userId: new ObjectId(userId),
      bookId: new ObjectId(bookId),
      isOpen: true,
    },
    {
      $inc: { returnedAmount: 1 },
    },
    { session }
  );
};

const closeBorrowing = async (userId, bookId, session) => {
  await borrowingsCollection.updateOne(
    {
      userId: new ObjectId(userId),
      bookId: new ObjectId(bookId),
      isOpen: true,
    },
    {
      $set: { isOpen: false, closedAt: new Date() },
    },
    { session }
  );
};

const hasOpenBorrowingForBook = async (bookId) => {
  const found = await borrowingsCollection.findOne({
    bookId: new ObjectId(bookId),
    isOpen: true,
  });
  return !!found;
};

const fetchBorrowingsByUserId = async (userId) => {
  return await borrowingsCollection
    .find({ userId: new ObjectId(userId) })
    .toArray();
};

const fetchAllBorrowings = async (limit, skip) => {
  return await borrowingsCollection
    .find({})
    .skip(skip)
    .limit(limit)
    .toArray();
};

const hasOverdueBooks = async (userId) => {
  const now = new Date();
  const overdue = await borrowingsCollection.findOne({
    userId: new ObjectId(userId),
    isOpen: true,
    dueDate: { $lt: now },
  });
  return !!overdue; 
};

module.exports = {
  registerBorrowing,
  registerReturn,
  findBorrowedBooks,
  closeBorrowing,
  fetchAllBorrowings,
  fetchBorrowingsByUserId,
  hasOpenBorrowingForBook,
  hasOverdueBooks,
};