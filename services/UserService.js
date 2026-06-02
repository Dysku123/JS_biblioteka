const {
  findUserById,
  deleteUserById,
  updateEmailById,
  findEmailDuplicate,
  getAllUsers,
  changeUserRole,
} = require("../models/userModel");

const returnAllUsers = async () => {
  return await getAllUsers();
};

const updateUserRole = async (id, newRole) => {
  return await changeUserRole(id, newRole);
};

const deleteUser = async (id) => {
  await deleteUserById(id);
}

module.exports = {
  returnAllUsers,
  updateUserRole,
  deleteUser,
};
