const {
  createBook,
  findBookByTitle,
  findCollectionByAuthor,
  findCollectionByCategory,
  findCollectionByPublishedDate,
  increaseBookStock,
  fetchAvailableBooks,
  fetchAllBooks,
  updateBookDetails,
  decreaseBookStock,
  borrowABook,
  returnBookToStock,
} = require("../models/bookModel");

const {
  registerBorrowing,
  registerReturn,
  findBorrowedBooks,
  closeBorrowing,
} = require("../models/borrowingModel");

const { client } = require("../config/db");

const addNewBook = async (
  title,
  author,
  category,
  publishedDate,
  pages,
  totalCopies,
) => {
  const book = await findBookByTitle(title);
  if (book) {
    return await increaseBookStock(title, totalCopies);
  }
  await createBook(title, author, category, publishedDate, pages, totalCopies);
};

const getAllBooks = async (page, limit) => {
  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  const skip = (parsedPage - 1) * parsedLimit;

  return await fetchAllBooks(parsedLimit, skip);
};

const getAvailableBooks = async () => {
  return await fetchAvailableBooks();
};

const getBookByTitle = async (title) => {
  return await findBookByTitle(title);
};

const getCollectionByAuthor = async (author) => {
  return await findCollectionByAuthor(author);
};

const getCollectionByCategory = async (category) => {
  return await findCollectionByCategory(category);
};

const getCollectionByPublishedDate = async (publishedDate) => {
  return await findCollectionByPublishedDate(publishedDate);
};

const modifyBook = async (title, updatedData) => {
  const book = await findBookByTitle(title);
  if (!book) {
    throw new Error("książka nie istnieje");
  }
  await updateBookDetails(title, updatedData);
};

const processBorrowing = async (title, amount, userId) => {
  const session = client.startSession();
  try {
    session.startTransaction();
    const book = await findBookByTitle(title, session);
    if (!book) {
      throw new Error("książka nie istnieje");
    }

    if (amount > book.availableCopies) {
      throw new Error("za mało książek na stanie, nie można wypożyczyć");
    }
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    await borrowABook(title, amount, session);

    await registerBorrowing(userId, title, dueDate, amount, session);

    await session.commitTransaction();
    return dueDate;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

const processReturn = async (userId, title) => {
  const session = client.startSession();
  try {
    session.startTransaction();

    const borrowedbooks = await findBorrowedBooks(userId, title, session);
    if (!borrowedbooks) {
      throw new Error("nie ma takiego wypozyczenia");
    }
    await registerReturn(userId, title, session);
    await returnBookToStock(title, session);
    if (borrowedbooks.returnedAmount + 1 === borrowedbooks.borrowedAmount) {
      await closeBorrowing(userId, title, session);
    }
    await session.commitTransaction();
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

module.exports = {
  addNewBook,
  getAllBooks,
  getAvailableBooks,
  getBookByTitle,
  getCollectionByAuthor,
  getCollectionByCategory,
  getCollectionByPublishedDate,
  modifyBook,
  processBorrowing,
  processReturn,
};
