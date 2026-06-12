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

// --- TRASY POST / PUT / DELETE ---
router.post("/add", verifyToken, isLibrarian, addBook);
router.put("/:id", verifyToken, isLibrarian, editBookDetails);
router.delete("/:id", verifyToken, isLibrarian, deleteBook);
router.post("/:id/borrow", verifyToken, borrowBook);
router.post("/:id/return", verifyToken, returnBook);

// --- TRASY GET (Kolejność ma tu krytyczne znaczenie) ---

// 1. Ścieżki w pełni statyczne
router.get("/", showAllBooks);
router.get("/available", showAvailableBooks);
router.get("/borrowings", verifyToken, isLibrarian, returnallBorrowings);

// 2. Ścieżki dynamiczne ze statycznym przedrostkiem
router.get("/author/:author", showCollectionByAuthor);
router.get("/category/:category", showCollectionByCategory);
router.get("/publishedDate/:publishedDate", showCollectionByPublishedDate);

// 3. Ścieżka w pełni dynamiczna (catch-all) - ZAWSZE NA DOLE
router.get("/:id", showBookById);

module.exports = router;