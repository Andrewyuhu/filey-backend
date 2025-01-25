const { PrismaClient } = require("@prisma/client");
const path = require("path");
const supabaseClient = require("../config/supabaseClient");
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

// This function will interact with the supabase client and upload the user file
async function uploadFile(req, res, next) {
  const file = req.file.buffer;
  const fileName = req.file.originalname;
  const { data, error } = await supabaseClient.storage
    .from("fileuploader")
    .upload(`uploads/${fileName}`, file);

  // todo : add proper error handling here, can just use global error handler for this project
  if (error) {
    res.redirect("/");
  }
  req.body.uploadData = data;
  next();
}

// This function will add the fileName and any needed identifying information to the files database
async function addFile(req, res, next) {
  // todo : figure out how to properly create a file within a sub folder that is not root
  // const parentFolder = ""
  next();
}

async function downloadFile(req, res) {
  // Needs to the file name and extension
  return;
}

module.exports = {
  createFolder,
  getRootFolders,
  getSubFolders,
  deleteFolder,
  uploadFile,
  addFile,
  downloadFile,
};
