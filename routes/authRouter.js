const { Router } = require("express");
const authController = require("../controllers/authController");
const authRouter = Router();

authRouter.get("/sign-in", authController.getSignIn);
authRouter.post("/sign-in", authController.signIn);

module.exports = authRouter;
