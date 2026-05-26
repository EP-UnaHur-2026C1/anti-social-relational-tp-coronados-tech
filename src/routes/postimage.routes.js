const express = require("express");
const router = express.Router();
const { PostImage } = require("../db/models");
const {
  createPostImage,
  getAllPostImages,
  getPostImageById,
  updatePostImage,
  deletePostImage,
} = require("../controllers/postimage.controller");
const schemaValidatorMiddleware = require("../middlewares/validations/schema.middleware");
const numericParamValidateMiddleware = require("../middlewares/validations/numeric.middleware");
const existValidateMiddleware = require("../middlewares/validations/exist.middleware");
const { uploadPostImage, uploadSingleImage } = require("../middlewares/upload.middleware");
const updatePostImageSchema = require("../schemas/postimage.schema");

router.get("/", getAllPostImages);
router.post("/", uploadPostImage, createPostImage);
router.get(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(PostImage, "id"),
  getPostImageById
);
router.patch(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(PostImage, "id"),
  uploadSingleImage,
  schemaValidatorMiddleware(updatePostImageSchema, "PostImage"),
  updatePostImage
);
router.delete(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(PostImage, "id"),
  deletePostImage
);

module.exports = router;
