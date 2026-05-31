const { Post, User, PostImage, Comment, Tag } = require("../db/models");
const { removeAllByPostId } = require("./postimage.service");
const postIncludes = [
  {
    model: User,
    as: "user",
    attributes: ["id", "nickname", "name", "lastName"],
  },
  { model: PostImage, as: "postImages" },
  { model: Tag, as: "tags", attributes: ["id", "name"] },
  { model: Comment, as: "comments", attributes: ["id", "content"] },
];

const resolveTags = async (tagNames = []) => {
  const tagInstances = [];

  for (const tagName of tagNames) {
    const normalized = tagName.trim().toLowerCase();

    const [tag] = await Tag.findOrCreate({
      where: { name: normalized },
    });

    tagInstances.push(tag);
  }

  return tagInstances;
};

const findAll = ({ user_id } = {}) => {
  const where = user_id !== undefined ? { user_id } : {};
  return Post.findAll({ where, include: postIncludes });
};

const findById = (id) => Post.findByPk(id, { include: postIncludes });

const create = async ({ description, user_id, tags }) => {
  const post = await Post.create({ description, user_id });
  if (tags && tags.length > 0) {
    const tagInstances = await resolveTags(tags);
    await post.setTags(tagInstances);
  }

  return Post.findByPk(post.id, {
    include: postIncludes,
  });
};

const update = async (id, { description, tags }) => {
  const post = await Post.findByPk(id);
  if (!post) return null;
  if (description === undefined && tags === undefined) return { empty: true };

  if (description !== undefined) {
    await post.update({ description });
  }

  if (tags !== undefined) {
    const tagInstances = await resolveTags(tags);
    await post.setTags(tagInstances);
  }

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
