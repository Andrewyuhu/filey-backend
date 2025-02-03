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
    if (err.code == "P2002") throw new AppError("Duplicate username", 409);
    throw err;
  }
}

async function findUserById(id) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) throw new AppError("User not found", 404);
  return user;
}

async function findUserByUsername(username) {
  const user = await prisma.user.findUnique({
    where: {
      username: username,
    },
  });

  if (!user) throw new AppError("User not found", 404);
  return user;
}

module.exports = { createUser, findUserById, findUserByUsername };
