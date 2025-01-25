const { genPassword } = require("../util/passwordUtil");
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

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

module.exports = { signUp };
