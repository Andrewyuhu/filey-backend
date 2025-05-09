const jwt = require("jsonwebtoken");
const { validatePassword } = require("../util/passwordUtil");
const asyncHandler = require("express-async-handler");
const AppError = require("../error/AppError");
const { findUserByUsername } = require("../db/db");
require("dotenv").config();

// todo : to be
function getSignIn(req, res) {
  res.render("signIn");
}

const signIn = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new AppError("Username and password required", 404);
  }

  const user = await findUserByUsername(username);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  const validPassword = await validatePassword(password, user.password);

  if (!validPassword) {
    throw new AppError("Incorrect password", 401);
  }

  jwt.sign(
    { username: user.username, userId: user.id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
    function (err, token) {
      if (err) {
        throw new AppError("Unable to generate JWT", 500);
      }
      res.cookie("jwt", token, {
        httpOnly: true,
        // sameSite: "None", // reconsider this during deployment!
        expires: new Date(Date.now() + 3600000),
      });
      return res.status(200).json({ username: user.username, userId: user.id });
    }
  );
});

async function signOut(req, res) {
  res.clearCookie("jwt");
  res.status(200).send();
}

const authenticateUser = asyncHandler(async (req, res) => {
  const token = req.cookies.jwt;

  if (!token) {
    throw new AppError("No jwt token found", 401);
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      throw new AppError("Forbidden: Invalid token", 403);
    }
    const decodedUser = { username: decoded.username, id: decoded.userId };

    res.status(200).json(decodedUser);
  });
});

module.exports = { getSignIn, signIn, signOut, authenticateUser };
