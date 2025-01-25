const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const prisma = require("../config/prisma");
const { validatePassword } = require("../util/passwordUtil");

passport.use(
  new LocalStrategy(async (username, password, done) => {
    try {
      const user = await prisma.user.findFirst({
        where: {
          username: username,
        },
      });
      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const validPassword = validatePassword(password, user.password);
      if (!validPassword) {
        return done(null, false, { message: "Incorrect password" });
      }
      console.log("succesful login");
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  })
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: id,
      },
    });
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
