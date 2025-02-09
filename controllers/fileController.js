const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const AppError = require("../error/AppError");
const { createFile } = require("../db/db");
const path = require("path");
const extractFileInformation = require("../util/extractFileInformation");
const supabaseClient = require("../config/supabaseClient");

const addFileDB = asyncHandler(async (req, res, next) => {
  // todo : probably need to implmement proper error handling here, maybe default folderId to ROOT if needed
  const folderId = req.body.folderId ? Number(req.body.folderId) : undefined;

  const { url, fileName, fileSize, fileType } = extractFileInformation(
    req.file,
    req.body.uploadData
  );

  const newFile = await createFile(
    url,
    fileName,
    fileSize,
    fileType,
    folderId,
    req.user.id
  );

  req.newFile = newFile;

  res.status(200).json(newFile);
});

const uploadFileSB = asyncHandler(async (req, res, next) => {
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
});

// This function will interact with the supabase client and upload the user file

module.exports = { addFileDB, uploadFileSB };
