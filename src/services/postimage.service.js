const { PostImage, Post } = require("../db/models");
const { deleteFileFromUrl } = require("../helpers/fileHelper");

const postInclude = {
  model: Post,
  as: "post",
  attributes: ["id", "description"],
};

const defaultInclude = [postInclude];

const findPost = (postId) => Post.findByPk(postId);

const findAll = () => PostImage.findAll({ include: defaultInclude });

const findById = (id) => PostImage.findByPk(id, { include: defaultInclude });

const findByPostId = async (postId) => {
  const post = await findPost(postId);
  if (!post) return { post: null, images: null };

  const images = await PostImage.findAll({
    where: { post_id: postId },
    include: defaultInclude,
  });

  return { post, images };
};

const create = ({ postId, url }) => PostImage.create({ url, post_id: postId });

const update = async (id, { postId, url }) => {
  const postImage = await PostImage.findByPk(id);
  if (!postImage) return { status: "not_found" };

  if (postId != null) {
    const post = await findPost(postId);
    if (!post) return { status: "post_not_found" };
  }

  if (url) {
    deleteFileFromUrl(postImage.url);
  }

  await postImage.update({
    post_id: postId ?? postImage.post_id,
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

const remove = async (id) => {
  const postImage = await PostImage.findByPk(id);
  if (!postImage) return false;

  deleteFileFromUrl(postImage.url);
  await postImage.destroy();
  return true;
};

const updateInPost = async (postId, imageId, { url }) => {
  const post = await findPost(postId);
  if (!post) return { status: "post_not_found" };

  const postImage = await PostImage.findOne({
    where: { id: imageId, post_id: postId },
  });
  if (!postImage) return { status: "image_not_found" };

  if (url) {
    deleteFileFromUrl(postImage.url);
    await postImage.update({ url });
  }

  return { status: "ok", postImage };
};

const removeFromPost = async (postId, imageId) => {
  const post = await findPost(postId);
  if (!post) return "post_not_found";

  const postImage = await PostImage.findOne({
    where: { id: imageId, post_id: postId },
  });
  if (!postImage) return "image_not_found";

  deleteFileFromUrl(postImage.url);
  await postImage.destroy();
  return "ok";
};

module.exports = {
  findPost,
  findAll,
  findById,
  findByPostId,
  create,
  update,
  removeAllByPostId,
  updateInPost,
  remove,
  removeFromPost,
};
