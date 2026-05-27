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

const findAll = ({ user_id } = {}) => {
  const where = user_id !== undefined ? { user_id } : {};
  return Post.findAll({ where, include: postIncludes });
};

const findById = (id) => Post.findByPk(id, { include: postIncludes });

const create = async ({ description, user_id, tags }) => {
  const post = await Post.create({ description, user_id });
  if (tags && tags.length > 0) {
    const tagInstances = [];

    for (const tagName of tags) {
      const normalized = tagName.trim().toLowerCase();

      const [tag] = await Tag.findOrCreate({
        where: { name: normalized },
      });

      tagInstances.push(tag);
    }

    await post.setTags(tagInstances);
  }

  return Post.findByPk(post.id, {
    include: postIncludes,
  });
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
