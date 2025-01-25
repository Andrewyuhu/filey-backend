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

async function signOut(req, res) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
}

module.exports = { getSignIn, signIn, signOut };
