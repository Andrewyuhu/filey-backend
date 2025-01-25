const { genPassword } = require("../util/passwordUtil");
const prisma = require("../config/prisma");

async function signUp(req, res) {
  const { username, password } = req.body;
  const hashedPassword = await genPassword(password);
  const createdUser = await prisma.user.create({
    data: {
      username: username,
      password: hashedPassword,
    },
  });
  console.log(createdUser);
  res.redirect("/");
}

function getSignUp(req, res) {
  res.render("signUp");
}

module.exports = { signUp, getSignUp };
