const { Router } = require("express");
const folderController = require("../controllers/folderController");
const isUserAuthenticated = require("../middleware/authMiddleware");
const folderRouter = Router();

// Auth Middleware to prevent unauthorized access
folderRouter.use(isUserAuthenticated);

folderRouter.get("/", folderController.getRootFolders); // todo : remove this and combine with folders/:folderId
folderRouter.get("/folder", folderController.getRootFolder);
folderRouter.get("/folder/:folderId", folderController.getSubFolder);
folderRouter.post("/folder", folderController.addFolder); // create a folder
folderRouter.delete("/folder/:folderId", folderController.deleteFolder); // delete a folder
folderRouter.delete("/delete-file/:fileId", folderController.deleteFile);
folderRouter.patch("/update-folder/:folderId"); // Update file name

module.exports = folderRouter;
