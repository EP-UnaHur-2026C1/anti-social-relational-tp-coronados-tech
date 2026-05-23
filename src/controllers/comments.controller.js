const { Comment, User, Post } = require("../db/models");
const {
  updateCommentVisibility,
} = require("../helpers/updateCommentVisibility");

// GET /comments — obtener todos los comentarios
const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nickname", "name", "lastName"],
        },
        { model: Post, as: "post", attributes: ["id", "description"] },
      ],
    });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los comentarios",
      error: error.message,
    });
  }
};

// GET /comments/:id — obtener un comentario por ID
const getCommentById = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "nickname", "name", "lastName"],
        },
        { model: Post, as: "post", attributes: ["id", "description"] },
      ],
    });

    if (!comment) {
      return res
        .status(404)
        .json({ message: `Comentario con id ${id} no encontrado` });
    }

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el comentario",
      error: error.message,
    });
  }
};

// GET /comments/post/:postId — obtiene comentarios del post y actualiza isVisible según antigüedad
const getCommentsByPost = async (req, res) => {
  try {
    const { postId } = req.params;

    const post = await Post.findByPk(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: `Post con id ${postId} no encontrado` });
    }

    // Actualiza isVisible de todos los comentarios de este post antes de responder
    await updateCommentVisibility({ postId });

    const comments = await Comment.findAll({
      where: { postId },
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
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los comentarios del post",
      error: error.message,
    });
  }
};

// POST /comments — crear un nuevo comentario
const createComment = async (req, res) => {
  try {
    const { content, userId, postId } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res
        .status(404)
        .json({ message: `Usuario con id ${userId} no encontrado` });
    }

    const post = await Post.findByPk(postId);
    if (!post) {
      return res
        .status(404)
        .json({ message: `Post con id ${postId} no encontrado` });
    }

    const newComment = await Comment.create({ content, userId, postId });

    res.status(201).json(newComment);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error al crear el comentario", error: error.message });
  }
};

// PUT /comments/:id — actualizar un comentario
const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content, isVisible } = req.body;

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res
        .status(404)
        .json({ message: `Comentario con id ${id} no encontrado` });
    }

    await comment.update({ content, isVisible });

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el comentario",
      error: error.message,
    });
  }
};

// DELETE /comments/:id — eliminar un comentario
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    const comment = await Comment.findByPk(id);
    if (!comment) {
      return res
        .status(404)
        .json({ message: `Comentario con id ${id} no encontrado` });
    }

    await comment.destroy();

    res
      .status(200)
      .json({ message: `Comentario con id ${id} eliminado correctamente` });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el comentario",
      error: error.message,
    });
  }
};

module.exports = {
  getAllComments,
  getCommentById,
  getCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
};
