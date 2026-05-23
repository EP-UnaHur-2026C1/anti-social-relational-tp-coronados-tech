const { Post, User, PostImage } = require("../db/models");
const { removeAllByPostId } = require("./postimage.service");

const postIncludes = [
  {
    model: User,
    as: "user",
    attributes: ["id", "nickname", "name", "lastName"],
  },
  { model: PostImage, as: "postImages" },
];

const findAll = () => Post.findAll({ include: postIncludes });

const findById = (id) => Post.findByPk(id, { include: postIncludes });

const create = async ({ description, user_id }) => {
  const post = await Post.create({ description, user_id });
  return Post.findByPk(post.id, { include: postIncludes });
};

const update = async (id, { description }) => {
  const post = await Post.findByPk(id);
  if (!post) return null;
  if (description === undefined) return { empty: true };

  await post.update({ description });
  return Post.findByPk(id, { include: postIncludes });
};

const remove = async (id) => {
  const post = await Post.findByPk(id);
  if (!post) return false;

  await removeAllByPostId(id);
  await post.destroy();
  return true;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
