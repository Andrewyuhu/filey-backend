const express = require("express");
const folderRouter = require("./routes/folderRouter");
const signUpRouter = require("./routes/signUpRouter");
const methodOverride = require("method-override");
const fildHandlerMiddleware = require("./middleware/fileHandlerMiddleware");
const { multerErrorHandler } = require("./middleware/errorMiddleware");
const { uploadFile, addFile } = require("./controllers/folderController");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("@prisma/client");
const expressSession = require("express-session");
const app = express();

require("dotenv").config();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use("/", signUpRouter);
app.use("/", folderRouter);

app.get("/", (req, res) => {
  res.render("index");
});

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

app.listen(3000, (req, res) => {
  console.log("Server is running...");
});
