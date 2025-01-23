const express = require("express");
const folderRouter = require("./routes/folderRouter");
var methodOverride = require("method-override");
const fildHandlerMiddleware = require("./middleware/fileHandlerMiddleware");

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
  (req, res) => {
    res.redirect("/");
  }
);

app.listen(3000, (req, res) => {
  console.log("Server is running...");
});
