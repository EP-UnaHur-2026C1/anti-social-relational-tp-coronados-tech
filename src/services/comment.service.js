const { Comment, User, Post } = require("../db/models");

const commentIncludes = [
  {
    model: User,
    as: "user",
    attributes: ["id", "nickname", "name", "lastName"],
  },
  {
    model: Post,
    as: "post",
    attributes: ["id", "description"],
  },
];

const findAll = () => Comment.findAll({ include: commentIncludes });

const findById = (id) => Comment.findByPk(id, { include: commentIncludes });

const create = async ({ content, user_id, post_id }) => {
  const comment = await Comment.create({
    content,
    user_id,
    post_id,
  });

  return Comment.findByPk(comment.id, {
    include: commentIncludes,
  });
};

const update = async (id, { content }) => {
  const comment = await Comment.findByPk(id);

  if (!comment) return null;

  if (content === undefined) return { empty: true };

  await comment.update({ content });

  return Comment.findByPk(id, {
    include: commentIncludes,
  });
};

const remove = async (id) => {
  const comment = await Comment.findByPk(id);

  if (!comment) return false;

  await comment.destroy();

  return true;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
