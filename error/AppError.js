class AppError extends Error {
  constructor(message, code) {
    super(message);
    this.code = code || 400;
    this.name = "AppError";
  }
}

module.exports = AppError;
