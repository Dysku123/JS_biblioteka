const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/bookController");
const { verifyToken, isLibrarian, isAdmin } = require("../middleware/auth");

router.post("/add", verifyToken, isLibrarian, addBook);
router.put("/:id", verifyToken, isLibrarian, editBookDetails);
router.delete("/:id", verifyToken, isLibrarian, deleteBook);
router.post("/:id/borrow", verifyToken, borrowBook);
router.post("/:id/return", verifyToken, returnBook);

router.get("/", showAllBooks);
router.get("/available", showAvailableBooks);
router.get("/borrowings", verifyToken, isLibrarian, returnallBorrowings);

router.get("/author/:author", showCollectionByAuthor);
router.get("/category/:category", showCollectionByCategory);
router.get("/publishedDate/:publishedDate", showCollectionByPublishedDate);

router.get("/:id", showBookById);

module.exports = router;