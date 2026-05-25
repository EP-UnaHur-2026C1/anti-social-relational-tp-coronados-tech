const express = require("express");
const router = express.Router();
const { User, Post, Comment } = require("../db/models");
const {
  getAllComments,
  getCommentById,
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/comments.controller");
const {
  commentSchema,
  updateCommentSchema,
} = require("../schemas/comment.schema");
const schemaValidatorMiddleware = require("../middlewares/validations/schema.middleware");
const existValidateMiddleware = require("../middlewares/validations/exist.middleware");
const numericParamValidateMiddleware = require("../middlewares/validations/numeric.middleware");

// GET /comments
router.get("/", getAllComments);

// GET /comments/:id
router.get(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(Comment, "id"),
  getCommentById,
);

// GET /comments/post/:postId
router.get(
  "/post/:post_id",
  numericParamValidateMiddleware("post_id"),
  getCommentsByPost,
);

// POST /comments
router.post(
  "/",
  schemaValidatorMiddleware(commentSchema),
  existValidateMiddleware(User, "user_id"),
  existValidateMiddleware(Post, "post_id"),
  createComment,
);

// PUT /comments/:id
router.put(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(Comment, "id"),
  schemaValidatorMiddleware(updateCommentSchema),
  updateComment,
);

// DELETE /comments/:id
router.delete(
  "/:id",
  numericParamValidateMiddleware("id"),
  existValidateMiddleware(Comment, "id"),
  deleteComment,
);

module.exports = router;
