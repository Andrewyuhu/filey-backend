const { Router } = require("express");
const folderController = require("../controllers/folderController");

const folderRouter = Router();

folderRouter.get("/", folderController.getRootFolders);
folderRouter.get("/folder/:folderId", folderController.getSubFolders);
folderRouter.post("/create-folder", folderController.createFolder); // create a folder
folderRouter.delete("/delete-folder/:folderId", folderController.deleteFolder); // delete a folder
folderRouter.patch("/update-folder/:folderId"); // Update file name

module.exports = folderRouter;
