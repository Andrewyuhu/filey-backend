const jwt = require("jsonwebtoken");
const AppError = require("../error/AppError");
require("dotenv").config();

function isUserAuthenticated(req, res, next) {
  const token = req.cookies.jwt;

  if (!token) {
    throw new AppError("No jwt token found", 401);
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      throw new AppError("Forbidden: Invalid token", 403);
    }
    const decodedUser = { username: decoded.username, id: decoded.userId };
    req.user = decodedUser;
    next();
  });
}

module.exports = isUserAuthenticated;
