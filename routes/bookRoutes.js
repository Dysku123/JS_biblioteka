const express = require("express");
const router = express.Router();
const { addBook, showAllBooks, showAvailableBooks, showBookByTitle, showCollectionByAuthor, 
    showCollectionByCategory, showCollectionByPublishedDate, editBookDetails, borrowBook, returnBook, } = require("../controllers/bookController");
const { verifyToken, isLibrarian } = require("../middleware/auth");

router.post("/add", verifyToken, isLibrarian, addBook);
router.get("/", showAllBooks);
router.get("/available", showAvailableBooks);
router.get("/:title", showBookByTitle);
router.get("/author/:author", showCollectionByAuthor);
router.get("/category/:category", showCollectionByCategory);
router.get("/publishedDate/:publishedDate", showCollectionByPublishedDate);
router.put("/:title", verifyToken, isLibrarian, editBookDetails);
router.post("/:title/borrow", verifyToken, borrowBook);
router.post("/:title/return", verifyToken, returnBook);


module.exports = router;

