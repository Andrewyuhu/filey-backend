const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const AppError = require("../error/AppError");
const { createFile } = require("../db/db");
const path = require("path");
const extractFileInformation = require("../util/extractFileInformation");
const supabaseClient = require("../config/supabaseClient");

const addFileDB = asyncHandler(async (req, res, next) => {
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

const getFileDownload = asyncHandler(async (req, res) => {
  const userID = req.user.id;
  const fileName = req.params.fileName;

  const { data, error } = await supabaseClient.storage
    .from("fileuploader")
    .createSignedUrl(`${userID}/${fileName}`, 120, { download: true });

  if (error) {
    throw new AppError(error.message, error.status);
  }

  return res.json({ url: data.signedUrl });
});

module.exports = { addFileDB, uploadFileSB, getFileDownload };
