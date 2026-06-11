const {
  createBook,
  findBookByTitle,
  findBookById,
  findCollectionByAuthor,
  findCollectionByCategory,
  findCollectionByPublishedDate,
  increaseBookStockById,
  fetchAvailableBooks,
  fetchAllBooks,
  updateBookDetailsById,
  decreaseBookStockById,
  borrowABookById,
  returnBookToStockById,
  deleteBookById,
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
  // Tutaj nadal używamy title, bo sprawdzamy czy taki tekst (tytuł) już jest w bazie
  const book = await findBookByTitle(title);
  if (book) {
    return await increaseBookStockById(book._id, totalCopies);
  }
  await createBook(title, author, category, publishedDate, pages, totalCopies);
};

const getAllBooks = async (page, limit) => {
  const parsedPage = Math.max(1, parseInt(page) || 1);
  const parsedLimit = Math.max(1, parseInt(limit) || 10);
  const skip = (parsedPage - 1) * parsedLimit;
  return await fetchAllBooks(parsedLimit, skip);
};

const getAvailableBooks = async (page, limit) => {
  const parsedPage = Math.max(1, parseInt(page) || 1);
  const parsedLimit = Math.max(1, parseInt(limit) || 10);
  const skip = (parsedPage - 1) * parsedLimit;
  return await fetchAvailableBooks(parsedLimit, skip);
};

const getBookById = async (id) => {
  return await findBookById(id);
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

const removeBook = async (id) => {
  const book = await findBookById(id);
  if (!book) {
    throw new AppError("książka nie istnieje", 404);
  }
  await deleteBookById(id);
};

const modifyBook = async (id, updatedData) => {
  const book = await findBookById(id);
  if (!book) {
    throw new AppError("książka nie istnieje", 404);
  }
  await updateBookDetailsById(id, updatedData);
};

const getAllBorrowings = async (page, limit) => {
  const parsedPage = Math.max(1, parseInt(page) || 1);
  const parsedLimit = Math.max(1, parseInt(limit) || 10);
  const skip = (parsedPage - 1) * parsedLimit;
  return await fetchAllBorrowings(parsedLimit, skip);
};

const processBorrowing = async (id, amount, userId) => {
  const hasOverdue = await hasOverdueBooks(userId);
  if (hasOverdue) {
    throw new AppError("nie można wypożyczyć książki, masz zaległe zwroty", 400);
  }
  const session = client.startSession();
  try {
    session.startTransaction();
    const book = await findBookById(id, session);
    if (!book) {
      throw new AppError("książka nie istnieje", 404);
    }

    if (amount > book.availableCopies) {
      throw new AppError("za mało książek na stanie, nie można wypożyczyć", 400);
    }
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    await borrowABookById(id, amount, session);
    // Przekazujemy id książki zamiast tytułu
    await registerBorrowing(userId, id, dueDate, amount, session);

    await session.commitTransaction();
    return dueDate;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

const processReturn = async (userId, id) => {
  const session = client.startSession();
  try {
    session.startTransaction();

    const borrowedbooks = await findBorrowedBooks(userId, id, session);
    if (!borrowedbooks) {
      throw new AppError("nie ma takiego wypozyczenia", 404);
    }

    const now = new Date();
    let isLate = false;

    if (now > borrowedbooks.dueDate) {
      isLate = true;
    }

    await registerReturn(userId, id, session);
    await returnBookToStockById(id, session);
    if (borrowedbooks.returnedAmount + 1 === borrowedbooks.borrowedAmount) {
      await closeBorrowing(userId, id, session);
    }
    await session.commitTransaction();

    return isLate;
  } catch (err) {
    await session.abortTransaction();
    throw err;
  } finally {
    await session.endSession();
  }
};

const getBookByTitle = async (title) => {
  return await findBookByTitle(title);
}

// Zmieniono eksport getBookByTitle na getBookById
module.exports = {
  addNewBook,
  getAllBooks,
  getAvailableBooks,
  getBookById,
  getCollectionByAuthor,
  getCollectionByCategory,
  getCollectionByPublishedDate,
  modifyBook,
  processBorrowing,
  processReturn,
  removeBook,
  getAllBorrowings,
  getBookByTitle
};