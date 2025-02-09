const { PrismaClient } = require("@prisma/client");
const path = require("path");
const supabaseClient = require("../config/supabaseClient");
const extractFileInformation = require("../util/extractFileInformation");
const { v4: uuidv4 } = require("uuid");
const prisma = new PrismaClient();
const asyncHandler = require("express-async-handler");
const {
  getRootFolderContent,
  getSubFolderContent,
  createFolder,
  deleteFolderDB,
} = require("../db/db");
const AppError = require("../error/AppError");

const addFolder = asyncHandler(async (req, res) => {
  const { newFolder, folderId } = req.body;
  if (!newFolder) {
    throw new AppError("Invalid input", 400);
  }
  const folder = await createFolder(newFolder, req.user.id, folderId);
  return res.status(200).json(folder);
});

// todo : remove
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

// completed
const getSubFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;

  // this needs to be changed
  if (!Number.isInteger(Number(folderId)) || folderId < 0) {
    throw new AppError("Invalid folder ID", 400);
  }

  const parentFolderId = Number(folderId);
  const folderContent = await getSubFolderContent(parentFolderId, req.user.id);
  return res.status(200).json(folderContent);
});

// completed
const getRootFolder = asyncHandler(async (req, res) => {
  console.log("running root folder route");
  const folderContent = await getRootFolderContent(req.user.id);
  return res.status(200).json(folderContent);
});

// completed
const deleteFolder = asyncHandler(async (req, res) => {
  const { folderId } = req.params;

  if (isNaN(folderId)) {
    throw new AppError("Invalid folder ID", 400);
  }

  const deletedFolder = await deleteFolderDB(folderId, req.user.id);

  const fullFileUrls = deletedFolder.file.map((file) => {
    return file.url;
  });

  if (fullFileUrls.length != 0) {
    await deleteFilesSupabase(fullFileUrls, req.user.id);
  }

  return res.status(200).json(deletedFolder);
});

// This function will interact with the supabase client and upload the user file
async function uploadFile(req, res, next) {
  const file = req.file.buffer; // file to be uploaded
  const fileName = uuidv4() + path.extname(req.file.originalname); // create unique name

  const { data, error } = await supabaseClient.storage
    .from("fileuploader")
    .upload(`${req.user.id}/${fileName}`, file);

  if (error) {
    throw new AppError(error.message, 500);
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

const getParentChain = asyncHandler(async (req, res) => {
  const { folderId } = req.params;

  if (!Number.isInteger(Number(folderId)) || folderId < 0) {
    throw new AppError("Invalid input", 400);
  }
  const parentChain = [];

  let currentFolder = await prisma.folder.findUnique({
    where: {
      id: Number(folderId),
      ownerId: req.user.id,
    },
    select: {
      id: true,
      folderName: true,
      folderId: true,
    },
  });

  if (!currentFolder) {
    throw new AppError("Folder not found", 400);
  }

  while (currentFolder?.folderId) {
    currentFolder = await prisma.folder.findUnique({
      where: {
        id: Number(currentFolder.folderId),
        ownerId: req.user.id,
      },
      select: {
        id: true,
        folderName: true,
        folderId: true,
      },
    });
    if (!currentFolder) {
      throw new AppError("Folder not found", 400);
    }
    parentChain.unshift(currentFolder);
  }
  return res.status(200).json({ parentChain: parentChain });
});

module.exports = {
  addFolder,
  getRootFolders,
  getRootFolder,
  getSubFolder,
  deleteFolder,
  uploadFile,
  addFile,
  downloadFile,
  deleteFile,
  getParentChain,
};
