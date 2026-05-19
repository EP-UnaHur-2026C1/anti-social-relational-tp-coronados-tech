const { Comment } = require("../db/models");

const updateCommentVisibility = async ({ postId, userId } = {}) => {
  const mesLimite = parseInt(process.env.MESES) || 6;

  const where = {};
  if (postId) where.postId = postId;
  if (userId) where.userId = userId;

  const comments = await Comment.findAll({ where });

  for (const comment of comments) {
    const shouldBeVisible = comment.monthsOld < mesLimite;

    if (comment.isVisible !== shouldBeVisible) {
      await comment.update({ isVisible: shouldBeVisible });
    }
  }
};

module.exports = { updateCommentVisibility };
