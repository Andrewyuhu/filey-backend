const { genPassword } = require("../util/passwordUtil");
const asyncHandler = require("express-async-handler");
const db = require("../db/db");

const signUp = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "missing password or username" });
  }

  const hashedPassword = await genPassword(password);

  await db.createUser(username, hashedPassword);

  return res.status(201).json({ username: username });
});

function getSignUp(req, res) {
  res.render("signUp");
}

module.exports = { signUp, getSignUp };
