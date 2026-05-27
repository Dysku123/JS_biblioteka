const bcrypt = require("bcrypt");
const { createUser } = require("../models/userModel");
const { registerEmailDuplicate } = require("../models/userModel");
const { findUserByEmail } = require("../models/userModel");

const registerUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await createUser(email, hashedPassword);
  } catch (err) {
    if (err.code === 11000) {
      throw new Error("Podany adres email jest już zajęty");
    }
    throw err; 
  }
};

const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new Error("Nieprawidłowe dane logowania");
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new Error("Nieprawidłowe dane logowania");
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
};
