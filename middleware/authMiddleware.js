const jwt = require("jsonwebtoken");
require("dotenv").config();

function isUserAuthenticated(req, res, next) {
  const token = req.cookies.JWT;

  if (!token) {
    return res.redirect("/sign-in");
  }

  jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
    if (err) {
      return res.status(403).json({ message: "Forbidden: Invalid token" });
    }

    const decodedUser = { username: decoded.username, id: decoded.userId };

    req.user = decodedUser; // Store user info from the token
    console.log(req.user);
    res.locals.currentUser = decodedUser;
    next(); // Pass request to next middleware or route handler
  });
}

module.exports = isUserAuthenticated;
