const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/bookController");
const { verifyToken, isLibrarian, isAdmin } = require("../middleware/auth");

// --- TRASY POST / PUT / DELETE ---
router.post("/add", verifyToken, isLibrarian, addBook);
router.put("/:title", verifyToken, isLibrarian, editBookDetails);
router.delete("/:title", verifyToken, isLibrarian, deleteBook);
router.post("/:title/borrow", verifyToken, borrowBook);
router.post("/:title/return", verifyToken, returnBook);

// --- TRASY GET (Kolejność ma tu krytyczne znaczenie) ---

// 1. Ścieżki w pełni statyczne (dokładne dopasowanie)
router.get("/", showAllBooks);
router.get("/available", showAvailableBooks);
router.get("/borrowings", verifyToken, isLibrarian, returnallBorrowings);

// 2. Ścieżki dynamiczne ze statycznym przedrostkiem
router.get("/author/:author", showCollectionByAuthor);
router.get("/category/:category", showCollectionByCategory);
router.get("/publishedDate/:publishedDate", showCollectionByPublishedDate);

// 3. Ścieżka w pełni dynamiczna (tzw. catch-all dla GET) - ZAWSZE NA DOLE
router.get("/:title", showBookByTitle);

module.exports = router;