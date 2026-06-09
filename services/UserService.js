const {
  deleteUserById,
  getAllUsers,
  changeUserRole,
} = require("../models/userModel");

const returnAllUsers = async () => {
  return await getAllUsers();
};

const modifyUserRole = async (id, newRole) => {
  return await changeUserRole(id, newRole);
};

const removeUser = async (id) => {
  await deleteUserById(id);
};

module.exports = {
  returnAllUsers,
  modifyUserRole,
  removeUser,
};
