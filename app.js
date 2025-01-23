const express = require("express");

const app = express();

const fildHandlerMiddleware = require("./middleware/fileHandlerMiddleware");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

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
