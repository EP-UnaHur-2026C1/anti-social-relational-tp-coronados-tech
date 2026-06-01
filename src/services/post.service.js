const { Post, User, PostImage, Comment, Tag } = require("../db/models");
const { removeAllByPostId } = require("./postimage.service");
const postCache = require("./postCache.service");

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

const serializePost = (post) => {
  const json = post.toJSON();

  if (post.comments?.length) {
    json.comments = post.comments.map((comment) => ({
      ...comment.toJSON(),
      monthsOld: comment.monthsOld,
    }));
  }

  return json;
};

const listCacheKey = (user_id) =>
  user_id !== undefined ? `posts:user:${user_id}` : "posts:all";

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

const findAll = async ({ user_id } = {}) => {
  const cacheKey = listCacheKey(user_id);
  const cached = postCache.get(cacheKey);
  if (cached) return cached;

  const where = user_id !== undefined ? { user_id } : {};
  const posts = await Post.findAll({ where, include: postIncludes });
  const serialized = posts.map(serializePost);

  postCache.set(cacheKey, serialized);
  return serialized;
};

const findById = async (id) => {
  const cacheKey = `post:${id}`;
  const cached = postCache.get(cacheKey);
  if (cached) return cached;

  const post = await Post.findByPk(id, { include: postIncludes });
  if (!post) return null;

  const serialized = serializePost(post);
  postCache.set(cacheKey, serialized);
  return serialized;
};

const create = async ({ description, user_id, tags }) => {
  const post = await Post.create({ description, user_id });
  if (tags && tags.length > 0) {
    const tagInstances = await resolveTags(tags);
    await post.addTags(tagInstances);
  }

  postCache.deleteAll();

  return findById(post.id);
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

  postCache.deletePost(id);

  return findById(id);
};

const remove = async (id) => {
  const post = await Post.findByPk(id);
  if (!post) return false;

  await removeAllByPostId(id);
  await post.destroy();
  postCache.deletePost(id);
  return true;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
