const express = require("express");
const router = express.Router();
const { Post, User } = require("../db/models");

const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} = require("../controllers/post.controller");

const {
  getPostImagesByPost,
  createPostImage,
  deletePostImageFromPost,
} = require("../controllers/postimage.controller");

const schemaValidatorMiddleware = require("../middlewares/validations/schema.middleware");
const existValidateMiddleware = require("../middlewares/validations/exist.middleware");

const { upload } = require("../middlewares/upload.middleware");
const {postSchema, updatePostSchema} = require('../schemas/post.schema')

router.get("/", getAllPosts);

router.post(
  "/",
  schemaValidatorMiddleware(postSchema),
  existValidateMiddleware(User, "user_id"),
  createPost
);
// 
  //existValidateMiddleware(user, "user_id"),

/*
router.get(
  "/:postId/images",
  numericParamValidateMiddleware("postId"),
  existValidateMiddleware(Post, "postId"),
  getPostImagesByPost
);
router.post(
  "/:postId/images",
  numericParamValidateMiddleware("postId"),
  existValidateMiddleware(Post, "postId"),
  upload.single("image"),
  createPostImage
);
router.delete(
  "/:postId/images/:imageId",
  numericParamValidateMiddleware("postId"),
  existValidateMiddleware(Post, "postId"),
  deletePostImageFromPost
);

router.get(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(Post, "id"),
  getPostById
);
router.put(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(Post, "id"),
  schemaValidatorMiddleware(updatePostSchema, "Post"),
  updatePost
);
router.delete(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(Post, "id"),
  deletePost
);
*/
module.exports = router;