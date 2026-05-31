const { PostImage, Post } = require("../db/models");
const { deleteFileFromUrl } = require("../helpers/fileHelper");

const findPost = (postId) => Post.findByPk(postId);

const findAll = () => PostImage.findAll();

const findById = (id) => PostImage.findByPk(id);

const findByPostId = async (postId) => {
  const post = await findPost(postId);
  if (!post) return { post: null, images: null };

  const images = await PostImage.findAll({
    where: { post_id: postId },
  });

  return { post, images };
};

const create = ({ postId, url }) => PostImage.create({ url, post_id: postId });

const findScoped = async (id, postId) => {
  const where = { id };
  if (postId != null) where.post_id = postId;

  const postImage = await PostImage.findOne({ where });
  if (postImage) return { postImage };

  if (postId != null) {
    const post = await findPost(postId);
    if (!post) return { status: "post_not_found" };
    return { status: "image_not_found" };
  }

  return { status: "not_found" };
};

const update = async (id, { postId, url, newPostId }) => {
  const scoped = await findScoped(id, postId);
  if (scoped.status) return scoped;

  const { postImage } = scoped;

  const targetPostId = newPostId ?? postImage.post_id;
  if (newPostId != null) {
    const post = await findPost(newPostId);
    if (!post) return { status: "post_not_found" };
  }

  if (url) {
    deleteFileFromUrl(postImage.url);
  }

  await postImage.update({
    post_id: targetPostId,
    url: url ?? postImage.url,
  });

  return { status: "ok", postImage };
};

const removeAllByPostId = async (postId) => {
  const images = await PostImage.findAll({ where: { post_id: postId } });
  for (const image of images) {
    deleteFileFromUrl(image.url);
    await image.destroy();
  }
};

const remove = async (id, { postId } = {}) => {
  const scoped = await findScoped(id, postId);
  if (scoped.status) return scoped;

  deleteFileFromUrl(scoped.postImage.url);
  await scoped.postImage.destroy();
  return { status: "ok" };
};

module.exports = {
  findPost,
  findAll,
  findById,
  findByPostId,
  create,
  update,
  removeAllByPostId,
  remove,
};
