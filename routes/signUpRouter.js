const { Router } = require("express");
const signUpController = require("../controllers/signUpController");
const signUpRouter = Router();

signUpRouter.get("/sign-up"); // Get the sign up page
signUpRouter.post("/sign-up", signUpController.signUp); // Create an account

module.exports = signUpRouter;
