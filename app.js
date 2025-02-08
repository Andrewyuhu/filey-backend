const express = require("express");
const folderRouter = require("./routes/folderRouter");
const signUpRouter = require("./routes/signUpRouter");
const methodOverride = require("method-override");
const AppError = require("./error/AppError");
const fildHandlerMiddleware = require("./middleware/fileHandlerMiddleware");
const { multerErrorHandler } = require("./middleware/errorMiddleware");
const { uploadFile, addFile } = require("./controllers/folderController");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/authRouter");
const cors = require("cors");
const fileRouter = require("./routes/fileRouter");
const app = express();

require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/", authRouter);
app.use("/", signUpRouter);
app.use("/", folderRouter);
app.use("/", fileRouter);

// app.post(
//   "/file",
//   fildHandlerMiddleware.single("uploaded_file"),
//   multerErrorHandler,
//   uploadFile,
//   addFile,
//   (req, res) => {
//     res.status(200).json({ success: "file uploaded" });
//   }
// );

app.use((err, req, res, next) => {
  if (err instanceof AppError) {
    return res.status(err.code).json({ error: err.message });
  }
  return res.status(500).send(err);
});

app.listen(3000, (req, res) => {
  console.log("Server is running...");
});
