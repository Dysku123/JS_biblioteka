const { usersCollection } = require("../config/db");
const { ObjectId } = require("mongodb");

const findUserByEmail = async (email) => {
  return await usersCollection.findOne({ email });
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

const changeUserRole = async (id, newRole) =>{
  await usersCollection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        role: newRole,
      },
    },
  );
}

const findUserById = async (id, includePassword = false) => {
  const options = includePassword ? {} : { projection: { password: 0 } };

  return await usersCollection.findOne({ _id: new ObjectId(id) }, options);
};

const deleteUserById = async (id) => {
  await usersCollection.updateOne(
    {
      _id: new ObjectId(id),
    },
    {
      $set: {
        isActive: false,
        deletedAt: new Date(),
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
