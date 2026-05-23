const HTTP = require("../config/HttpCode");
const { buildPublicUrl } = require("../helpers/fileHelper");
const postImageService = require("../services/postimage.service");

const resolvePostId = (req) =>
  req.params.id ??
  req.params.postId ??
  req.params.post_id ??
  req.body?.postId ??
  req.body?.post_id;

const notFoundPost = (res, id) =>
  res.status(HTTP.NOT_FOUND).json({
    message: res.__("id_dont_exist", { id, nombreModelo: "Post" }),
  });

const notFoundPostImage = (res, id) =>
  res.status(HTTP.NOT_FOUND).json({
    message: res.__("id_dont_exist", { id, nombreModelo: "PostImage" }),
  });

const createPostImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(HTTP.BAD_REQUEST).json({ message: res.__("no_image_sent") });
    }

    const postId = resolvePostId(req);
    if (!postId) {
      return res.status(HTTP.BAD_REQUEST).json({ message: res.__("postId_required") });
    }

    const post = await postImageService.findPost(postId);
    if (!post) {
      return notFoundPost(res, postId);
    }

    const url = buildPublicUrl(req, req.file.filename);
    const postImage = await postImageService.create({ postId, url });

    res.status(HTTP.CREATED).json(postImage);
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: res.__("error_create_post_image"),
      error: error.message,
    });
  }
};

const getAllPostImages = async (req, res) => {
  try {
    const postImages = await postImageService.findAll();
    res.status(HTTP.OK).json(postImages);
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: res.__("error_get_post_images"),
      error: error.message,
    });
  }
};

const getPostImageById = async (req, res) => {
  try {
    const { id } = req.params;
    const postImage = await postImageService.findById(id);

    if (!postImage) {
      return notFoundPostImage(res, id);
    }

    res.status(HTTP.OK).json(postImage);
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: res.__("error_get_post_image"),
      error: error.message,
    });
  }
};

const getPostImagesByPost = async (req, res) => {
  try {
    const postId = resolvePostId(req);
    const { post, images } = await postImageService.findByPostId(postId);

    if (!post) {
      return notFoundPost(res, postId);
    }

    res.status(HTTP.OK).json(images);
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: res.__("error_get_post_images_by_post"),
      error: error.message,
    });
  }
};

const updatePostImage = async (req, res) => {
  try {
    const { id } = req.params;
    const url = req.file ? buildPublicUrl(req, req.file.filename) : undefined;
    const result = await postImageService.update(id, {
      postId: req.body.postId,
      url,
    });

    if (result.status === "not_found") {
      return notFoundPostImage(res, id);
    }

    if (result.status === "post_not_found") {
      return notFoundPost(res, req.body.postId);
    }

    res.status(HTTP.OK).json(result.postImage);
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: res.__("error_update_post_image"),
      error: error.message,
    });
  }
};

const deletePostImage = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await postImageService.remove(id);

    if (!deleted) {
      return notFoundPostImage(res, id);
    }

    res.status(HTTP.OK).json({ message: res.__("delete_post_image", { id }) });
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: res.__("error_delete_post_image"),
      error: error.message,
    });
  }
};

const updatePostImageFromPost = async (req, res) => {
  try {
    const postId = resolvePostId(req);
    const imageId = req.params.image_id ?? req.params.imageId;

    if (!req.file) {
      return res.status(HTTP.BAD_REQUEST).json({ message: res.__("no_image_sent") });
    }

    const url = buildPublicUrl(req, req.file.filename);
    const result = await postImageService.updateInPost(postId, imageId, { url });

    if (result.status === "post_not_found") {
      return notFoundPost(res, postId);
    }

    if (result.status === "image_not_found") {
      return res.status(HTTP.NOT_FOUND).json({
        message: res.__("post_image_not_in_post", { imageId, postId }),
      });
    }

    res.status(HTTP.OK).json(result.postImage);
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: res.__("error_update_post_image"),
      error: error.message,
    });
  }
};

const deletePostImageFromPost = async (req, res) => {
  try {
    const postId = resolvePostId(req);
    const imageId = req.params.image_id ?? req.params.imageId;
    const result = await postImageService.removeFromPost(postId, imageId);

    if (result === "post_not_found") {
      return notFoundPost(res, postId);
    }

    if (result === "image_not_found") {
      return res.status(HTTP.NOT_FOUND).json({
        message: res.__("post_image_not_in_post", { imageId, postId }),
      });
    }

    res.status(HTTP.OK).json({
      message: res.__("delete_post_image_from_post", { imageId, postId }),
    });
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: res.__("error_delete_post_image_from_post"),
      error: error.message,
    });
  }
};

module.exports = {
  createPostImage,
  getAllPostImages,
  getPostImageById,
  getPostImagesByPost,
  updatePostImage,
  updatePostImageFromPost,
  deletePostImage,
  deletePostImageFromPost,
};
