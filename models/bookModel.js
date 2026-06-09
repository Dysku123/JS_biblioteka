const { booksCollection } = require("../config/db");
const { ObjectId } = require("mongodb"); // Importujemy klasę do obsługi systemowych ID
const AppError = require("../errors/AppError");

const createBook = async (
  title,
  author,
  category,
  publishedDate,
  pages,
  totalCopies,
) => {
  await booksCollection.insertOne({
    title,
    author,
    category,
    publishedDate,
    pages,
    availableCopies: totalCopies,
    totalCopies,
    isDeleted: false,
  });
};

// Zostawiamy do weryfikacji przy dodawaniu nowej książki
const findBookByTitle = async (title, session) => {
  return await booksCollection.findOne(
    { title, isDeleted: false },
    { session },
  );
};

// NOWA FUNKCJA: Wyszukiwanie po systemowym ID
const findBookById = async (id, session) => {
  return await booksCollection.findOne(
    { _id: new ObjectId(id), isDeleted: false },
    { session },
  );
};

const findCollectionByAuthor = async (author) => {
  return await booksCollection.find({ author, isDeleted: false }).toArray();
};

const findCollectionByCategory = async (category) => {
  return await booksCollection.find({ category, isDeleted: false }).toArray();
};

const findCollectionByPublishedDate = async (publishedDate) => {
  return await booksCollection
    .find({ publishedDate, isDeleted: false })
    .toArray();
};

const increaseBookStockById = async (id, amount) => {
  await booksCollection.updateOne(
    {
      _id: new ObjectId(id),
      isDeleted: false,
    },
    {
      $inc: { totalCopies: amount, availableCopies: amount },
    },
  );
};

const fetchAllBooks = async (limit, skip) => {
  return await booksCollection
    .find({ isDeleted: false })
    .skip(skip)
    .limit(limit)
    .toArray();
};

const fetchAvailableBooks = async (limit, skip) => {
  return await booksCollection
    .find({ availableCopies: { $gt: 0 }, isDeleted: false })
    .skip(skip)
    .limit(limit)
    .toArray();
};

const updateBookDetailsById = async (id, updatedData) => {
  await booksCollection.updateOne(
    { _id: new ObjectId(id), isDeleted: false },
    {
      $set: updatedData,
    },
  );
};

const deleteBookById = async (id) => {
  await booksCollection.updateOne(
    { _id: new ObjectId(id), isDeleted: false },
    { $set: { isDeleted: true } },
  );
};

const decreaseBookStockById = async (id, amount) => {
  await booksCollection.updateOne(
    { _id: new ObjectId(id), isDeleted: false },
    { $inc: { totalCopies: -amount, availableCopies: -amount } },
  );
};

const borrowABookById = async (id, amount, session) => {
  const result = await booksCollection.updateOne(
    { _id: new ObjectId(id), availableCopies: { $gte: amount }, isDeleted: false },
    { $inc: { availableCopies: -amount } },
    { session: session },
  );
  if (result.modifiedCount === 0) {
    throw new AppError(
      "Nie można wypożyczyć książki, brak wystarczającej ilości egzemplarzy",
      400
    );
  }
};

const returnBookToStockById = async (id, session) => {
  const result = await booksCollection.updateOne(
    {
      _id: new ObjectId(id),
      $expr: { $lt: ["$availableCopies", "$totalCopies"] },
      isDeleted: false,
    },
    { $inc: { availableCopies: 1 } },
    { session: session },
  );
  if (result.modifiedCount === 0) {
    throw new AppError("Stan magazynowy jest już pełny", 400);
  }
};

module.exports = {
  createBook,
  findBookByTitle,
  findBookById,
  findCollectionByAuthor,
  findCollectionByCategory,
  findCollectionByPublishedDate,
  increaseBookStockById,
  fetchAllBooks,
  fetchAvailableBooks,
  updateBookDetailsById,
  deleteBookById,
  decreaseBookStockById,
  borrowABookById,
  returnBookToStockById,
};