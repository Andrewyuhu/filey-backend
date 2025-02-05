const { Router } = require("express");
const fileController = require("../controllers/fileController");
const fildHandlerMiddleware = require("../middleware/fileHandlerMiddleware");
const { multerErrorHandler } = require("../middleware/errorMiddleware");
const fileRouter = Router();

fileRouter.post(
  "/file",
  fildHandlerMiddleware.single("uploaded_file"),
  multerErrorHandler,
  fileController.uploadFileSB,
  fileController.addFileDB
);

fileRouter.delete("/file");

module.exports = fileRouter;
