const express = require("express");
const folderRouter = require("./routes/folderRouter");
const methodOverride = require("method-override");
const fildHandlerMiddleware = require("./middleware/fileHandlerMiddleware");
const { multerErrorHandler } = require("./middleware/errorMiddleware");
const { uploadFile } = require("./controllers/folderController");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.use("/", folderRouter);

app.get("/", (req, res) => {
  res.render("index");
});

app.post(
  "/submit-file",
  fildHandlerMiddleware.single("uploaded_file"),
  multerErrorHandler,
  (req, res) => {
    res.redirect("/");
  }
);

app.listen(3000, (req, res) => {
  console.log("Server is running...");
});
