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

async function getFolderContent(folderId, userId) {
  const folder = await prisma.folder.findFirst({
    where: {
      id: folderId,
    },
    include: {
      childrenFolder: true,
    },
  });

  if (!folder) {
    throw new AppError("Folder not found", 404);
  }

  console.log(folder.ownerId);
  console.log(userId);

  if (folder.ownerId != userId) {
    throw new AppError("Forbidden", 403);
  }

  const files = await prisma.file.findMany({
    where: {
      folderId: folderId,
      ownerId: userId,
    },
  });

  return { files: files, folders: folder.childrenFolder };
}

async function createFolder(folderName, userId, parentId = undefined) {
  await prisma.folder.create({
    data: {
      folderName: folderName,
      folderId: parentId,
      ownerId: userId,
    },
  });
  return { folderName: folderName, ownerId: userId };
}

async function deleteFolderDB(folderId, userId) {
  console.log("3");
  const deletedFolder = await prisma.folder.delete({
    where: {
      id: Number(folderId),
      ownerId: userId,
    },
    include: {
      file: true,
    },
  });

  return {
    folderName: deletedFolder.folderName,
    ownerId: deletedFolder.ownerId,
    file: deletedFolder.file,
  };
}

async function createFile(url, fileName, fileSize, fileType, folderId, userId) {
  const newFile = await prisma.file.create({
    data: {
      url: url,
      fileName: fileName,
      fileSize: fileSize,
      fileType: fileType,
      folderId: folderId,
      ownerId: userId,
    },
  });
  return newFile;
}

module.exports = {
  createUser,
  findUserById,
  findUserByUsername,
  getFolderContent,
  createFolder,
  deleteFolderDB,
  createFile,
};
