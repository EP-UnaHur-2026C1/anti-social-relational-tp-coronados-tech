const HTTP = require("../config/HttpCode");
const HttpError = require("../helpers/HttpError");

const errorMiddleware = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  if (err instanceof HttpError) {
    return res.status(err.status).json({
      message: res.__(err.messageKey, err.params),
    });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0].path; 
    
    return res.status(HTTP.CONFLICT || 409).json({
      message: res.__("user_already_exists", { field }), 
      error: err.message
    });
  }

  console.error(err);
  res.status(HTTP.INTERNAL_SERVER_ERROR).json({
    message: res.__("error_internal"),
    error: err.message,
  });
};

module.exports = errorMiddleware;
