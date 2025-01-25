const { Router } = require("express");
const authController = require("../controllers/authController");
const authRouter = Router();

authRouter.get("/sign-in", authController.getSignIn);
authRouter.post("/sign-in", authController.signIn);
authRouter.post("/sign-out", authController.signOut);

module.exports = authRouter;
