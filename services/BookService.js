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
  deleteBookByTitle,
} = require("../models/bookModel");

const {
  registerBorrowing,
  registerReturn,
  findBorrowedBooks,
  closeBorrowing,
  fetchAllBorrowings,
  hasOverdueBooks,
} = require("../models/borrowingModel");

const AppError = require("../errors/AppError");

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

const removeBook = async (title) => {
  const book = await findBookByTitle(title);
  if (!book) {
    throw new Error("książka nie istnieje");
  }
  await deleteBookByTitle(title);
};

const modifyBook = async (title, updatedData) => {
  const book = await findBookByTitle(title);
  if (!book) {
    throw new Error("książka nie istnieje");
  }
  await updateBookDetails(title, updatedData);
};

const getAllBorrowings = async (page, limit) => {
  const parsedPage = parseInt(page);
  const parsedLimit = parseInt(limit);

  const skip = (parsedPage - 1) * parsedLimit;

  return await fetchAllBorrowings(parsedLimit, skip);
};

const processBorrowing = async (title, amount, userId) => {
  const hasOverdue = await hasOverdueBooks(userId);
  if (hasOverdue) {
    throw new AppError("nie można wypożyczyć książki, masz zaległe zwroty", 400);
  }
  const session = client.startSession();
  try {
    session.startTransaction();
    const book = await findBookByTitle(title, session);
    if (!book) {
      throw new AppError("książka nie istnieje", 404);
    }

    if (amount > book.availableCopies) {
      throw new AppError("za mało książek na stanie, nie można wypożyczyć", 400);
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
      throw new AppError("nie ma takiego wypozyczenia", 404);
    }

    // --- SPRAWDZANIE TERMINOWOŚCI ---
    const now = new Date();
    let isLate = false;

    if (now > borrowedbooks.dueDate) {
      isLate = true;
    }

    await registerReturn(userId, title, session);
    await returnBookToStock(title, session);
    if (borrowedbooks.returnedAmount + 1 === borrowedbooks.borrowedAmount) {
      await closeBorrowing(userId, title, session);
    }
    await session.commitTransaction();

    // Zwracamy flagę, czy było opóźnienie
    return isLate;
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
  removeBook,
  getAllBorrowings,
};
