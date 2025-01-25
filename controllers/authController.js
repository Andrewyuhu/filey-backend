const passport = require("../config/passport");

function getSignIn(req, res) {
  res.render("signIn");
}

async function signIn(req, res) {
  console.log("Trying to login");
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/sign-in",
  })(req, res);
}

module.exports = { getSignIn, signIn };
