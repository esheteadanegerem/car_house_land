// utils/jwt.js
const jwt = require('jsonwebtoken');

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },  // include role
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },  // include role
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

const verifyToken = (token) => jwt.verify(token, process.env.JWT_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, process.env.JWT_REFRESH_SECRET);

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  verifyRefreshToken
};
