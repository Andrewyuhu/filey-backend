const { genPassword } = require("../util/passwordUtil");
const asyncHandler = require("express-async-handler");

const signUp = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    res.status(400).json({ error: "missing password or username" });
  }

  const hashedPassword = await genPassword(password);

  await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  });

  return res.status(201).json({ username: username });
});

function getSignUp(req, res) {
  res.render("signUp");
}

module.exports = { signUp, getSignUp };
