const multer = require("multer");
const HTTP = require("../config/HttpCode");
const HttpError = require("./HttpError");

const mapUploadError = (err) => {
  if (!err) return null;
  if (err instanceof HttpError) return err;

  if (err instanceof multer.MulterError) {
    switch (err.code) {
      case "LIMIT_UNEXPECTED_FILE":
        return new HttpError(HTTP.BAD_REQUEST, "upload_unexpected_field", {
          field: err.field,
        });
      case "LIMIT_FILE_SIZE":
        return new HttpError(HTTP.BAD_REQUEST, "upload_file_too_large");
      default:
        return new HttpError(HTTP.BAD_REQUEST, "upload_error");
    }
  }

  if (err.message?.includes("Solo se permiten")) {
    return new HttpError(HTTP.BAD_REQUEST, "upload_invalid_type");
  }

  return null;
};

module.exports = { mapUploadError };
