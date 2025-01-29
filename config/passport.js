const passport = require("passport");
const jwtStrategy = require("passport-jwt").Strategy;
const prisma = require("../config/prisma");
const { validatePassword } = require("../util/passwordUtil");
const { ExtractJwt } = require("passport-jwt");

require("dotenv").config();

// Using Cookies to store the jwt
const cookieExtractor = function (req) {
  const token = null;
  if (req && req.cookies) {
    token = req.cookies["JWT"];
  }
  return token;
};

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(
  new jwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          id: jwt_payload.id,
        },
      });
      if (user) {
        return done(null, user);
      }
      return done(err, false);
    } catch (err) {
      return done(err, false);
    }
  })
);

module.exports = passport;
