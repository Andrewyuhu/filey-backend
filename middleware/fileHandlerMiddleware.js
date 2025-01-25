const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

// Filter to remove any executable files from being uploaded
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "application/x-msdownload" ||
    file.originalname.endsWith(".exe")
  ) {
    return cb(new multer.MulterError("FILE_EXT"), false);
  }
  cb(null, true);
};

const fildHandlerMiddleware = multer({
  storage: storage,
  limits: {
    fileSize: 2 * 1000000, // set max file size at 2 mb
  },
  fileFilter: fileFilter,
});

module.exports = fildHandlerMiddleware;
