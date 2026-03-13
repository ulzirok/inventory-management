const bycript = require("bcryptjs");
const jwt = require("jsonwebtoken");
const createError = require("../utils/createError");

function generateToken(user) {
  return jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1d" },
  );
}

function checkIsBlocked(user) {
  if (user.isBlocked) {
    throw createError("Your account is blocked", 403);
  }
}

async function checkPassword(password, hashPassword) {
  const isValid = await bycript.compare(password, hashPassword);
  if (!isValid) {
    throw createError("Incorrect email or password", 401);
  }
}

module.exports = {
  generateToken,
  checkIsBlocked,
  checkPassword
}