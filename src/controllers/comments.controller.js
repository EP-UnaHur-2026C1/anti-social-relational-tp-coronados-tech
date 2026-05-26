const { Comment, User, Post } = require("../db/models");
const {
  updateCommentVisibility,
} = require("../helpers/updateCommentVisibility");

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

const getCommentsByPost = async (req, res) => {
  const { post_id } = req.params;

  const post = await Post.findByPk(post_id);

  await updateCommentVisibility({ post_id });

  const comments = await Comment.findAll({
    where: { post_id },
    include: [
      {
        model: User,
        as: "user",
        attributes: ["id", "nickname", "name", "lastName"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json(comments);
};

const createComment = async (req, res) => {
  const { content, user_id, post_id } = req.body;

  const newComment = await Comment.create({ content, user_id, post_id });

  res.status(201).json(newComment);
};

const updateComment = async (req, res) => {
  const { id } = req.params;
  const { content, isVisible } = req.body;

  await comment.update({ content, isVisible });

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
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
};
