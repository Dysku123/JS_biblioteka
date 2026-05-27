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
  });
};

const findBookByTitle = async (title) => {
  return await booksCollection.findOne({ title });
};

const findCollectionByAuthor = async (author) => {
  return await booksCollection.find({ author }).toArray();
};

const findCollectionByCategory = async (category) => {
  return await booksCollection.find({ category }).toArray();
};

const findCollectionByPublishedDate = async (publishedDate) => {
  return await booksCollection.find({ publishedDate }).toArray();
};

const increaseBookStock = async (title, amount) => {
  await booksCollection.updateOne(
    {
      title: title,
    },
    {
        $inc: {totalCopies: amount, availableCopies: amount}
    }
  );
};

const fetchAllBooks = async() =>{
  return await booksCollection.find().toArray();
}

const fetchAvailableBooks = async()=>{
  return await booksCollection.find(
   { availableCopies: { $gt: 0 } }).toArray();
}

const updateBookDetails = async (title, updatedData) =>{
  await booksCollection.updateOne(
    {title: title},
    {
      $set: updatedData
    }
  )
}

const deleteBookByTitle = async (title) =>{
  await booksCollection.deleteOne(
    {title:title});
};

const decreaseBookStock = async (title, amount) =>{
  await booksCollection.updateOne(
    {title:title},
    { $inc: { totalCopies: -amount, availableCopies: -amount } });
};

const borrowABook = async (title, amount)=>{
  const result = await booksCollection.updateOne( //zapisujemy do zmiennej, zeby móc w tym grzebać
    {title:title,
      availableCopies: { $gte: amount }
    },
    {$inc: {availableCopies: -amount}});
    if(result.modifiedCount === 0){
      throw new Error("Nie można wypożyczyć książki, brak wystarczającej ilości egzemplarzy");// sprawdzamy metadane zapytania, zeby sprawdzic, czy cokolwiek zmieniliśmy
    }
}

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
  borrowABook
};
