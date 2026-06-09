const {
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
} = require("../services/BookService");
const AppError = require("../errors/AppError");

const { ObjectId } = require("mongodb");

const addBook = async (req, res, next) => {
  try {
    const { title, author, category, publishedDate, pages, totalCopies } =
      req.body;

    await addNewBook(
      title,
      author,
      category,
      publishedDate,
      pages,
      totalCopies,
    );

    return res.status(201).json({
      message: "utworzono ksiązkę lub zwiększono jej stan",
    });
  } catch (err) {
    next(err);
  }
};

const deleteBook = async (req, res, next) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return next(new AppError("Nieprawidłowy ID", 400));
  }
  try {
    await removeBook(id);
    return res.status(200).json({
      message: "książka została usunięta",
    });
  } catch (err) {
    next(err);
  }
};

const showAllBooks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const books = await getAllBooks(page, limit);

    return res.status(200).json({
      books,
    });
  } catch (err) {
    next(err);
  }
};

const showAvailableBooks = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const availableBooks = await getAvailableBooks(page, limit);
    return res.status(200).json({
      books: availableBooks,
    });
  } catch (err) {
    next(err);
  }
};

const showBookById = async (req, res, next) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return next(new AppError("Nieprawidłowy ID", 400));
  }
  try {
    const book = await getBookById(id);
    return res.status(200).json({
      book,
    });
  } catch (err) {
    next(err);
  }
};

const showCollectionByAuthor = async (req, res, next) => {
  const author = req.params.author;
  try {
    const books = await getCollectionByAuthor(author);
    return res.status(200).json({
      books,
    });
  } catch (err) {
    next(err);
  }
};

const showCollectionByCategory = async (req, res, next) => {
  const category = req.params.category;
  try {
    const books = await getCollectionByCategory(category);
    return res.status(200).json({
      books,
    });
  } catch (err) {
    next(err);
  }
};

const showCollectionByPublishedDate = async (req, res, next) => {
  const publishedDate = req.params.publishedDate;
  try {
    const books = await getCollectionByPublishedDate(publishedDate);
    return res.status(200).json({
      books,
    });
  } catch (err) {
    next(err);
  }
};

const editBookDetails = async (req, res, next) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return next(new AppError("Nieprawidłowy ID", 400));
  }
  const { author, category, publishedDate, pages } = req.body;
  const safeData = {};

  if (author) safeData.author = author;
  if (category) safeData.category = category;
  if (publishedDate) safeData.publishedDate = publishedDate;
  if (pages) safeData.pages = pages;

  if (Object.keys(safeData).length === 0) {
    return next(new AppError("Brak poprawnych danych do edycji", 400)); // jeśli safeData jest puste, to znaczy że nie ma żadnych danych do edycji, więc zwracamy błąd
  }

  try {
    await modifyBook(id, safeData);
    return res.status(200).json({
      message: "Zaktualizowano dane książki",
    });
  } catch (err) {
    next(err);
  }
};

const borrowBook = async (req, res, next) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return next(new AppError("Nieprawidłowy ID", 400));
  }
  const amount = req.body.amount;
  const userID = req.user.userId;
  if (!ObjectId.isValid(userID)) {
    return next(new AppError("Nieprawidłowy ID użytkownika", 400));
  }
  try {
    if (!Number.isInteger(amount) || amount < 1) {
      throw new AppError("Nie można wypożyczyć mniej niż 1 egzemplarz", 400);
    }
    const dueDate = await processBorrowing(id, amount, userID);
    return res.status(200).json({
      message: "poprawnie wypożyczono książke",
      dueDate: dueDate,
    });
  } catch (err) {
    next(err);
  }
};

const returnBook = async (req, res, next) => {
  const id = req.params.id;
  if (!ObjectId.isValid(id)) {
    return next(new AppError("Nieprawidłowy ID", 400));
  }
  const userID = req.user.userId;
  try {
    const isLate = await processReturn(userID, id);
    if (isLate) {
      return res.status(200).json({
        message: "poprawnie zwrócono książke, ale jest spóźniona",
      });
    } else {
      return res.status(200).json({
        message: "poprawnie zwrócono książke",
      });
    }
  } catch (err) {
    next(err);
  }
};

const returnallBorrowings = async (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const borrowings = await getAllBorrowings(page, limit);
    return res.status(200).json({
      borrowings,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  addBook,
  showAllBooks,
  showAvailableBooks,
  showBookById,
  showCollectionByAuthor,
  showCollectionByCategory,
  showCollectionByPublishedDate,
  editBookDetails,
  borrowBook,
  returnBook,
  returnallBorrowings,
  deleteBook,
};
