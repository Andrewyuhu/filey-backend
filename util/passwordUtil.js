const bcryptjs = require("bcryptjs");

// Takes a plain-text password and uses bcryptjs to hash the password
async function genPassword(password) {
  try {
    const hashedPassword = await bcryptjs.hash(password, 10);
    return hashedPassword;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
}

// Takes a plain-text password and hashedPassword and validates if they are the same
async function validatePassword(password, hashedPassword) {
  try {
    const isValidPassword = await bcryptjs.compare(password, hashedPassword);
    return isValidPassword;
  } catch (err) {
    console.log(err);
    return err;
  }
}

module.exports = { genPassword, validatePassword };
