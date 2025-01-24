const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();

const fildHandlerMiddleware = multer({ storage: storage }); // Sets up file uploads

module.exports = fildHandlerMiddleware;
