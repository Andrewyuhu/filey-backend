const { PrismaClient } = require("@prisma/client");
const path = require("path");
const supabaseClient = require("../config/supabaseClient");
const extractFileInformation = require("../util/extractFileInformation");
const { v4: uuidv4 } = require("uuid");
const prisma = new PrismaClient();

async function createFolder(req, res) {
  const { newFolder, folderId } = req.body;
  await prisma.folder.create({
    data: {
      folderName: newFolder,
      folderId: folderId ? Number(folderId) : undefined,
      ownerId: req.user.id,
    },
  });
  // Re-direct based on where folder was created
  if (folderId) {
    res.redirect(`/folder/${folderId}`);
  } else {
    res.redirect("/");
  }
}

// Renders home page
async function getRootFolders(req, res) {
  const rootFolders = await prisma.folder.findMany({
    where: {
      parentFolder: null,
      ownerId: req.user.id,
    },
  });

  // Sets res.locals.files to contain all folder files
  await getFolderFiles(null, res, req.user.id);
  res.locals.childrenFolders = rootFolders;
  res.render("index");
}

// Renders sub folder page
async function getSubFolders(req, res) {
  const { folderId } = req.params;
  const parentFolderId = Number(folderId);
  const parentFolder = await prisma.folder.findFirst({
    where: {
      id: parentFolderId,
      ownerId: req.user.id,
    },
    include: {
      childrenFolder: true,
    },
  });

  // Sets res.locals.files to contain all folder files
  await getFolderFiles(parentFolderId, res);
  res.locals.folder = parentFolder; //  Sets parent folder data
  res.locals.childrenFolders = parentFolder.childrenFolder; // Sets children folder of parent
  res.render("subFolder");
}

// Deletes folder & files in the folder
async function deleteFolder(req, res) {
  const { folderId } = req.params;
  const deletedFolder = await prisma.folder.delete({
    where: {
      id: Number(folderId),
      ownerId: req.user.id,
    },
    include: {
      file: true,
    },
  });
  const fullFileUrls = deletedFolder.file.map((file) => {
    return file.url;
  });
  await deleteFilesSupabase(fullFileUrls, req.user.id);
  if (deletedFolder.folderId) {
    res.redirect(`/folder/${deletedFolder.folderId}`);
  } else {
    res.redirect("/");
  }
}

// This function will interact with the supabase client and upload the user file
async function uploadFile(req, res, next) {
  const file = req.file.buffer; // file to be uploaded
  const fileName = uuidv4() + path.extname(req.file.originalname); // create unique name

  const { data, error } = await supabaseClient.storage
    .from("fileuploader")
    .upload(`${req.user.id}/${fileName}`, file);

  if (error) {
    throw new Error(error);
  }
  req.body.uploadData = data;
  next();
}

// This function will add the fileName and any needed identifying information to the files database
async function addFile(req, res, next) {
  // Defines file folder ID, if not sent, then default to ROOT folder
  const folderId = req.body.folderId ? Number(req.body.folderId) : undefined;
  const { url, fileName, fileSize, fileType } = extractFileInformation(
    req.file,
    req.body.uploadData
  );
  await prisma.file.create({
    data: {
      url: url,
      fileName: fileName,
      fileSize: fileSize,
      fileType: fileType,
      folderId: folderId,
      ownerId: req.user.id,
    },
  });
  next();
}

async function downloadFile(req, res) {
  // Needs to the file name and extension
  return;
}

// Only used during rendering to get folder specific files
async function getFolderFiles(folderId, res, userId) {
  const files = await prisma.file.findMany({
    where: {
      folderId: folderId,
      ownerId: userId,
    },
  });
  res.locals.files = files;
}

// Delete file(s) from Supabase
async function deleteFilesSupabase(fileUrls, userId) {
  // Append the folder
  const fullFileUrls = fileUrls.map((url) => {
    return `${userId}/${url}`;
  });
  console.log(fullFileUrls);
  const { data, error } = await supabaseClient.storage
    .from("fileuploader")
    .remove(fullFileUrls);

  if (error) {
    throw new Error(error);
  }
}

// Delete button function will delete a single file
async function deleteFile(req, res) {
  const { fileId } = req.params;

  // Deletes file from DB
  const deletedFile = await prisma.file.delete({
    where: {
      id: Number(fileId),
      ownerId: req.user.id,
    },
  });
  await deleteFilesSupabase([deletedFile.url], req.user.id); // Removes files from Supabase
  res.redirect("/");
}

module.exports = {
  createFolder,
  getRootFolders,
  getSubFolders,
  deleteFolder,
  uploadFile,
  addFile,
  downloadFile,
  deleteFile,
};
