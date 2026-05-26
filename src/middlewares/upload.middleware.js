const multer = require("multer");
const path = require("path");
const fs = require("fs");
const HTTP = require("../config/HttpCode");
const HttpError = require("../helpers/HttpError");
const { mapUploadError } = require("../helpers/uploadError.helper");

const UPLOAD_DIR = path.join(__dirname, "../../uploads/posts");

if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (_req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Solo se permiten imágenes JPEG, PNG o WebP"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const ACCEPTED_IMAGE_FIELDS = [
  { name: "image", maxCount: 1 },
  { name: "file", maxCount: 1 },
];

const wrapMulter = (multerMiddleware) => (req, res, next) => {
  multerMiddleware(req, res, (err) => {
    const httpError = mapUploadError(err);
    if (httpError) return next(httpError);
    if (err) return next(err);
    next();
  });
};

const uploadPostImage = (req, res, next) => {
  upload.fields(ACCEPTED_IMAGE_FIELDS)(req, res, (err) => {
    const httpError = mapUploadError(err);
    if (httpError) return next(httpError);
    if (err) return next(err);

    const imageFiles = req.files?.image ?? [];
    const fileFiles = req.files?.file ?? [];

    if (imageFiles.length + fileFiles.length > 1) {
      return next(new HttpError(HTTP.BAD_REQUEST, "upload_single_image_only"));
    }

    req.file = imageFiles[0] ?? fileFiles[0];
    next();
  });
};

const uploadSingleImage = wrapMulter(upload.single("image"));

module.exports = { upload, uploadPostImage, uploadSingleImage, UPLOAD_DIR };
