const {
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
} = require("../services/BookService");

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
  const title = req.params.title;
  try {
    await removeBook(title);
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
    const availableBooks = await getAvailableBooks();
    return res.status(200).json({
      books: availableBooks,
    });
  } catch (err) {
    next(err);
  }
};

const showBookByTitle = async (req, res, next) => {
  const title = req.params.title; // łapie nam w locie title z url, bo jest tam :title, i przypisuje do zmiennej title
  try {
    const book = await getBookByTitle(title);
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
  const title = req.params.title;
  const { author, category, publishedDate, pages } = req.body;
  const safeData = {};

  if (author) safeData.author = author;
  if (category) safeData.category = category;
  if (publishedDate) safeData.publishedDate = publishedDate;
  if (pages) safeData.pages = pages;

  if (Object.keys(safeData).length === 0) {
    return next(new AppError("Brak poprawnych danych do edycji", 400));// jeśli safeData jest puste, to znaczy że nie ma żadnych danych do edycji, więc zwracamy błąd
  }

  try {
    await modifyBook(title, safeData);
    return res.status(200).json({
      message: "Zaktualizowano dane książki",
    });
  } catch (err) {
    next(err);
  }
};

const borrowBook = async (req, res, next) => {
  const title = req.params.title;
  const amount = req.body.amount;
  const userID = req.user.userId;
  try {
    const dueDate = await processBorrowing(title, amount, userID);
    return res.status(200).json({
      message: "poprawnie wypożyczono książke",
      dueDate: dueDate,
    });
  } catch (err) {
    next(err);
  }
};

const returnBook = async (req, res, next) => {
  const title = req.params.title;
  const userID = req.user.userId;
  try {
    const isLate = await processReturn(userID, title);
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
  showBookByTitle,
  showCollectionByAuthor,
  showCollectionByCategory,
  showCollectionByPublishedDate,
  editBookDetails,
  borrowBook,
  returnBook,
  returnallBorrowings,
  deleteBook,
};
