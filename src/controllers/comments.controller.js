const { Comment, User, Post } = require("../db/models");

const commentIncludes = [
  {
    model: User,
    as: "user",
    attributes: ["id", "nickname", "name", "lastName"],
  },
  { model: Post, as: "post", attributes: ["id", "description"] },
];

const getAllComments = async (req, res) => {
  const comments = await Comment.findAll({ include: commentIncludes });
  res.status(200).json(comments);
};

const getCommentById = async (req, res) => {
  const { id } = req.params;
  const comment = await Comment.findByPk(id, { include: commentIncludes });
  res.status(200).json(comment);
};

const createComment = async (req, res) => {
  const { content, user_id, post_id } = req.body;

  const newComment = await Comment.create({ content, user_id, post_id });

  res.status(201).json(newComment);
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  await comment.update({ content });

  res.status(200).json(comment);
};
const deleteComment = async (req, res) => {
  const { id } = req.params;

  await comment.destroy();

  res
    .status(200)
    .json({ message: `Comentario con id ${id} eliminado correctamente` });
};

module.exports = {
  getAllComments,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
};
