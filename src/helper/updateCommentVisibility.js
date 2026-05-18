const { Comment } = require("../models");

/**
 * Actualiza el campo isVisible de los comentarios según la antigüedad configurada.
 * Puede recibir un filtro por postId o userId, o correr sobre todos los comentarios.
 *
 * @param {Object} options
 * @param {number} [options.postId]  - Filtrar comentarios de un post específico
 * @param {number} [options.userId] - Filtrar comentarios de un usuario específico
 *
 * Uso desde posts.controller.js:    await updateCommentVisibility({ postId: id });
 * Uso desde users.controller.js:    await updateCommentVisibility({ userId: id });
 * Uso desde comments.controller.js: await updateCommentVisibility({ postId });
 */
const updateCommentVisibility = async ({ postId, userId } = {}) => {
  const monthsLimit = parseInt(process.env.COMMENT_MONTHS_LIMIT) || 6;

  // Armar el filtro dinámicamente según lo que se pase
  const where = {};
  if (postId) where.postId = postId;
  if (userId) where.userId = userId;

  const comments = await Comment.findAll({ where });

  for (const comment of comments) {
    const shouldBeVisible = comment.monthsOld < monthsLimit;

    // Solo hace UPDATE si el estado realmente cambió
    if (comment.isVisible !== shouldBeVisible) {
      await comment.update({ isVisible: shouldBeVisible });
    }
  }
};

module.exports = { updateCommentVisibility };
