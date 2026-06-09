const { usersCollection } = require("../config/db");
const { ObjectId } = require("mongodb");
const AppError = require("../errors/AppError");

const findUserByEmail = async (email) => {
  return await usersCollection.findOne(
    { email, isActive: true });
};

const registerEmailDuplicate = async (email) => {
  return await usersCollection.findOne({
    email: email,
    isActive: true,
  });
};

const getAllUsers = async () => {
  return await usersCollection.find({ isActive: true }).toArray();
};

const createUser = async (email, password, role) => {
  await usersCollection.insertOne({
    email,
    password,
    role: role || "user",
    isActive: true,
  });
};

const changeUserRole = async (id, newRole) => {
  const result = await usersCollection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        role: newRole,
      },
    },
  );

  if (result.matchedCount === 0) {
    throw new AppError("Nie znaleziono użytkownika", 404);
  }

  return result;
};

const findUserById = async (id, includePassword = false) => {
  const options = includePassword ? {} : { projection: { password: 0 } };

  return await usersCollection.findOne({ _id: new ObjectId(id) }, options);
};

const deleteUserById = async (id) => {
  const deletedemail = `deleted_${Date.now()}@deleted.com`;
  await usersCollection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        isActive: false,
        deletedAt: new Date(),
        email: deletedemail
      },
    },
  );
};

const updateEmailById = async (id, newEmail) => {
  await usersCollection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        email: newEmail,
      },
    },
  );
};

const findEmailDuplicate = async (email, id) => {
  return await usersCollection.findOne({
    email: email,
    _id: { $ne: new ObjectId(id) },
    isActive: true,
  });
};

module.exports = {
  findUserByEmail,
  createUser,
  findUserById,
  deleteUserById,
  updateEmailById,
  findEmailDuplicate,
  registerEmailDuplicate,
  getAllUsers,
  changeUserRole
};
