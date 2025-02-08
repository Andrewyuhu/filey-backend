const { Router } = require("express");
const authController = require("../controllers/authController");
const isUserAuthenticated = require("../middleware/authMiddleware");
const authRouter = Router();

authRouter.get("/sign-in", authController.getSignIn);
authRouter.get("/me", isUserAuthenticated, authController.authenticateUser);
authRouter.post("/sign-in", authController.signIn);
authRouter.post("/sign-out", authController.signOut);

module.exports = authRouter;
