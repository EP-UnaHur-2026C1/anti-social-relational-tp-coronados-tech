const express = require("express");
const router = express.Router();
const {
  getAllComments,
  getCommentById,
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} = require("../controllers/comments.controller");

// GET /comments
router.get("/", getAllComments);

// GET /comments/:id
router.get("/:id", getCommentById);

// GET /comments/post/:postId
router.get("/post/:postId", getCommentsByPost);

// POST /comments
router.post("/", createComment);

// PUT /comments/:id
router.put("/:id", updateComment);

// DELETE /comments/:id
router.delete("/:id", deleteComment);

module.exports = router;
