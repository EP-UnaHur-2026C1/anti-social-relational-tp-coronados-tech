const path = require("path");
const { mapUploadError } = require("../helpers/uploadError.helper");
const { createStorage, MB } = require("../services/storage.service");

const POST_IMAGE_UPLOAD_DIR = path.join(__dirname, "../../uploads/posts");
const POST_IMAGE_MIMES = ["image/jpeg", "image/png", "image/webp"];
const POST_IMAGE_MAX_SIZE = 5 * MB;

const postImageStorage = createStorage({
  destination: POST_IMAGE_UPLOAD_DIR,
  allowedMimeTypes: POST_IMAGE_MIMES,
  maxFileSize: POST_IMAGE_MAX_SIZE,
});

const respondUploadError = (res, { status, messageKey, params = {} }) =>
  res.status(status).json({ message: res.__(messageKey, params) });

const handleUploadError = (err, res, next, errorConfig) => {
  const mapped = mapUploadError(err, errorConfig);
  if (mapped) {
    respondUploadError(res, mapped);
    return true;
  }
  if (err) {
    next(err);
    return true;
  }
  return false;
};

const wrapSingle = (fieldName) => (req, res, next) => {
  postImageStorage.upload.single(fieldName)(req, res, (err) => {
    if (handleUploadError(err, res, next, postImageStorage.errorConfig)) return;
    next();
  });
};

const uploadSingleImage = wrapSingle("image");

module.exports = {
  uploadSingleImage,
  UPLOAD_DIR: POST_IMAGE_UPLOAD_DIR,
};
