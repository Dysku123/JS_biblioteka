const bcrypt = require("bcrypt");
const { createUser } = require("../models/userModel");
const { findUserByEmail } = require("../models/userModel");
const AppError = require("../errors/AppError");

const registerUser = async (email, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await createUser(email, hashedPassword, role);
  } catch (err) {
    if (err.code === 11000) {
      throw new AppError("Podany adres email jest już zajęty", 400);
    }
    throw err; 
  }
};

const loginUser = async (email, password) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError("Nieprawidłowe dane logowania", 401);
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError("Nieprawidłowe dane logowania", 401);
  }
  return user;
};

module.exports = {
  registerUser,
  loginUser,
};
