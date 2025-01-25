// Multer error-handling middleware
const multer = require("multer");

const multerErrorHandler = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    console.log(err.code);
    const errorCode = err.code;
    res.locals.fileUploadErrorMessage =
      "An error occured when processing your file";
    switch (errorCode) {
      case "LIMIT_FILE_SIZE":
        res.locals.fileUploadErrorMessage =
          "File size is too large! File must be less then 2 mb";
      case "FILE_EXT":
        res.locals.fileUploadErrorMessage = "File extension not allowed";
    }
    // Todo : Render the correct page that the user is on (could be on subfolder instead of home)
    return res.render("index");
  }
  next(err); // Pass non-Multer errors to the global error handler
};

module.exports = { multerErrorHandler };
