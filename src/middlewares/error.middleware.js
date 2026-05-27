const HTTP = require("../config/HttpCode");

const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  console.error(err);
  res.status(HTTP.INTERNAL_SERVER_ERROR).json({
    message: res.__("error_internal"),
    error: err.message,
  });
};

module.exports = errorMiddleware;
