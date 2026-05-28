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
} = require("../models/bookModel");

const {
  registerBorrowing,
  registerReturn,
  findBorrowedBooks,
} = require("../models/borrowingModel");

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

const getAllBooks = async () => {
  return await fetchAllBooks();
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
  const book = await findBookByTitle(title);
  if (!book) {
    throw new Error("książka nie istnieje");
  }

  if (amount > book.availableCopies) {
    throw new Error("za mało książek na stanie, nie można wypożyczyć");
  }
  const dueDate = new Date();
  dueDate.setDate(dueDate.getDate() + 30);

  await borrowABook(title, amount);

  await registerBorrowing(userId, title, dueDate);

  return dueDate;
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
};
