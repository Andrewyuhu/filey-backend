const prisma = require("../config/prisma");
const AppError = require("../error/AppError");

async function createUser(username, password) {
  try {
    const newUser = await prisma.user.create({
      data: {
        username: username,
        password: password,
      },
    });
    return newUser;
  } catch (err) {
    if (err.code == "P2002") throw new AppError(409, "Duplicate username");
    throw err;
  }
}

module.exports = { createUser };
