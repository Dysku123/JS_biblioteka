const { booksCollection } = require("../config/db");

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

const findBookByTitle = async (title, session) => {
  return await booksCollection.findOne(
    { title, isDeleted: false },
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

const increaseBookStock = async (title, amount) => {
  await booksCollection.updateOne(
    {
      title: title,
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

const fetchAvailableBooks = async () => {
  return await booksCollection
    .find({ availableCopies: { $gt: 0 }, isDeleted: false })
    .toArray();
};

const updateBookDetails = async (title, updatedData) => {
  await booksCollection.updateOne(
    { title: title, isDeleted: false },
    {
      $set: updatedData,
    },
  );
};

const deleteBookByTitle = async (title) => {
  await booksCollection.updateOne(
    { title: title, isDeleted: false },
    { $set: { isDeleted: true } },
  );
};

const decreaseBookStock = async (title, amount) => {
  await booksCollection.updateOne(
    { title: title, isDeleted: false },
    { $inc: { totalCopies: -amount, availableCopies: -amount } },
  );
};

const borrowABook = async (title, amount, session) => {
  const result = await booksCollection.updateOne(
    { title: title, availableCopies: { $gte: amount }, isDeleted: false },
    { $inc: { availableCopies: -amount } },
    { session: session },
  );
  if (result.modifiedCount === 0) {
    throw new Error(
      "Nie można wypożyczyć książki, brak wystarczającej ilości egzemplarzy",
    );
  }
};

const returnBookToStock = async (title, session) => {
  const result = await booksCollection.updateOne(
    {
      title: title,
      $expr: { $lt: ["$availableCopies", "$totalCopies"] },
      isDeleted: false,
    },
    { $inc: { availableCopies: 1 } },
    { session: session },
  );
  if (result.modifiedCount === 0) {
    throw new Error("Stan magazynowy jest już pełny");
  }
};

module.exports = {
  createBook,
  findBookByTitle,
  findCollectionByAuthor,
  findCollectionByCategory,
  findCollectionByPublishedDate,
  increaseBookStock,
  fetchAllBooks,
  fetchAvailableBooks,
  updateBookDetails,
  deleteBookByTitle,
  decreaseBookStock,
  borrowABook,
  returnBookToStock,
};
