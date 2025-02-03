const express = require("express");
const folderRouter = require("./routes/folderRouter");
const signUpRouter = require("./routes/signUpRouter");
const methodOverride = require("method-override");
const fildHandlerMiddleware = require("./middleware/fileHandlerMiddleware");
const { multerErrorHandler } = require("./middleware/errorMiddleware");
const { uploadFile, addFile } = require("./controllers/folderController");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const cors = require("cors");
const app = express();

require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(cors());
app.use("/", authRouter);
app.use("/", signUpRouter);
app.use("/", folderRouter);

app.post(
  "/submit-file",
  fildHandlerMiddleware.single("uploaded_file"),
  multerErrorHandler,
  uploadFile,
  addFile,
  (req, res) => {
    const { folderId } = req.body;
    if (folderId) {
      res.redirect(`/folder/${folderId}`);
    } else {
      res.redirect("/");
    }
  }
);

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(500).send(err);
});

app.listen(3000, (req, res) => {
  console.log("Server is running...");
});
