const { borrowingsCollection } = require("../config/db");

const registerBorrowing = async(userId, title, dueDate) =>{
    await borrowingsCollection.insertOne(
        {userId,
        title,
        borrowedAt : new Date(),
        dueDate
        });
};

const fetchBorrowingsByUserId = async (userId) =>{
    return await borrowingsCollection.find(
        {userId}
    ).toArray();
}

module.exports={
    registerBorrowing,
    fetchBorrowingsByUserId
};