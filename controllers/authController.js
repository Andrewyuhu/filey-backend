const passport = require("../config/passport");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { validatePassword } = require("../util/passwordUtil");
const prisma = require("../config/prisma");

function getSignIn(req, res) {
  res.render("signIn");
}

async function signIn(req, res) {
  console.log(req.body);
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findFirst({
      where: {
        username: username,
      },
    });

    if (!user) {
      console.log("wrong username");
      return res.redirect("/");
    }
    const validPassword = validatePassword(password, user.password);
    if (!validPassword) {
      // render an error page or direct home
      console.log("wrong password");
      return res.redirect("/");
    }

    jwt.sign(
      { username: user.username, userId: user.id },
      process.env.JWT_SECRET,
      function (err, token) {
        if (err) {
          console.log("Error in token signing");
        }
        res.cookie("JWT", token),
          {
            httpOnly: true,
          };
        res.redirect("/");
      }
    );
  } catch (err) {
    // render an error page or direct home
    console.log("Error in the primsa request");
    console.log(err);
    res.redirect("/");
  }
}

async function signOut(req, res) {
  res.clearCookie("JWT");
  res.redirect("/sign-in");
}

module.exports = { getSignIn, signIn, signOut };
