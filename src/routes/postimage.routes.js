const express = require("express");
const router = express.Router();
const { Post, PostImage } = require("../db/models");
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
const { uploadSingleImage } = require("../middlewares/upload.middleware");
const { createPostImageSchema, updatePostImageSchema } = require("../schemas/postimage.schema");

router.get("/", getAllPostImages);
router.post(
  "/",
  uploadSingleImage,
  schemaValidatorMiddleware(createPostImageSchema),
  existValidateMiddleware(Post, "postId", { aliases: ["post_id"] }),
  createPostImage
);
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
  schemaValidatorMiddleware(updatePostImageSchema),
  existValidateMiddleware(Post, "postId", { optional: true, aliases: ["post_id"] }),
  updatePostImage
);
router.delete(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(PostImage, "id"),
  deletePostImage
);

module.exports = router;
