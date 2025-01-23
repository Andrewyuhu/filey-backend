const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function createFolder(req, res) {
  const { newFolder, folderId } = req.body;
  await prisma.folder.create({
    data: {
      folderName: newFolder,
      folderId: folderId ? Number(folderId) : undefined,
    },
  });
  // Re-direct based on where folder was created
  if (folderId) {
    res.redirect(`/folder/${folderId}`);
  } else {
    res.redirect("/");
  }
}

async function getRootFolders(req, res, next) {
  const rootFolders = await prisma.folder.findMany({
    where: {
      parentFolder: null,
    },
  });
  res.locals.childrenFolders = rootFolders;
  res.render("index");
}

async function getSubFolders(req, res) {
  const { folderId } = req.params;
  const parentFolderId = Number(folderId);
  const parentFolder = await prisma.folder.findFirst({
    where: {
      id: parentFolderId,
    },
    include: {
      childrenFolder: true,
    },
  });
  res.locals.folder = parentFolder; //  Sets parent folder data
  res.locals.childrenFolders = parentFolder.childrenFolder; // Sets children folder of parent
  res.render("subFolder");
}

// Cascading Delete
async function deleteFolder(req, res) {
  const { folderId } = req.params;
  const deletedFolder = await prisma.folder.delete({
    where: {
      id: Number(folderId),
    },
  });
  if (deletedFolder.folderId) {
    res.redirect(`/folder/${deletedFolder.folderId}`);
  } else {
    res.redirect("/");
  }
}

module.exports = {
  createFolder,
  getRootFolders,
  getSubFolders,
  deleteFolder,
};
