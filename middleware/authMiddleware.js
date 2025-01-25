function isUserAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    console.log("User is authenticated");
    res.locals.currentUser = req.user; // allow all renders to access the user object
    next();
  } else {
    console.log("User is not authenticated");
    res.redirect("/sign-in");
  }
}

module.exports = { isUserAuthenticated };
