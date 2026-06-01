const { Tag, Post } = require("../db/models");

const tagIncludes = [
  {
    model: Post,
    as: "posts",
    attributes: ["id", "description"],
    through: { attributes: [] },
  },
];

const findAll = ({ post_id } = {}) => {
  const postsInclude = {
    model: Post,
    as: "posts",
    attributes: ["id", "description"],
    through: { attributes: [] },
  };

  if (post_id !== undefined) {
    postsInclude.where = { id: post_id };
    postsInclude.required = true;
  }

  return Tag.findAll({ include: [postsInclude] });
};

const findById = (id) => Tag.findByPk(id, { include: tagIncludes });

const create = async ({ name, post_id }) => {
  const tag = await Tag.create({ name });

  if (post_id !== undefined) {
    const post = await Post.findByPk(post_id);
    if (post) {
      await post.addTag(tag);
    }
  }

  return Tag.findByPk(tag.id, { include: tagIncludes });
};

const update = async (id, { name }) => {
  const tag = await Tag.findByPk(id);

  if (!tag) return null;
  if (name === undefined) return { empty: true };

  await tag.update({ name });

  return Tag.findByPk(id, { include: tagIncludes });
};

const assignToPost = async (tagId, postId) => {
  const post = await Post.findByPk(postId);
  const tag = await Tag.findByPk(tagId);

  await post.addTag(tag); // solo agrega, no toca los tags existentes

  return Tag.findByPk(tagId, { include: tagIncludes });
};

const remove = async (id) => {
  const tag = await Tag.findByPk(id);

  if (!tag) return false;

  await tag.destroy();

  return true;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  assignToPost,
  remove,
};
