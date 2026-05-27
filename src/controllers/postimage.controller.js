const HTTP = require("../config/HttpCode");
const { buildPublicUrl } = require("../helpers/fileHelper");
const postImageService = require("../services/postimage.service");

const resolvePostId = (req) =>
    req.params.id ?? req.params.postId ?? req.params.post_id ?? req.body?.postId ?? req.body?.post_id;

const notFoundPost = (res, id) =>
    res.status(HTTP.NOT_FOUND).json({
        message: res.__("id_dont_exist", { id, nombreModelo: "Post" }),
    });

const notFoundPostImage = (res, id) =>
    res.status(HTTP.NOT_FOUND).json({
        message: res.__("id_dont_exist", { id, nombreModelo: "PostImage" }),
    });

const createPostImage = async (req, res) => {
    const url = buildPublicUrl(req, req.file.filename);
    const postImage = await postImageService.create({ postId, url });

    res.status(HTTP.CREATED).json(postImage);
};

const getAllPostImages = async (req, res) => {
    const postImages = await postImageService.findAll();
    res.status(HTTP.OK).json(postImages);
};

const getPostImageById = async (req, res) => {
    const { id } = req.params;
    const postImage = await postImageService.findById(id);

    res.status(HTTP.OK).json(postImage);
};

const getPostImagesByPost = async (req, res) => {
    const postId = resolvePostId(req);
    const { post, images } = await postImageService.findByPostId(postId);

    res.status(HTTP.OK).json(images);
};

const updatePostImage = async (req, res) => {
    const { id } = req.params;
    const url = req.file ? buildPublicUrl(req, req.file.filename) : undefined;
    const result = await postImageService.update(id, {
        postId: req.body.postId,
        url,
    });

    res.status(HTTP.OK).json(result.postImage);
};

const deletePostImage = async (req, res) => {
    const { id } = req.params;
    await postImageService.remove(id);

    res.status(HTTP.OK).json({ message: res.__("delete_post_image", { id }) });
};

const updatePostImageFromPost = async (req, res) => {
    const postId = resolvePostId(req);
    const imageId = req.params.image_id ?? req.params.imageId;
    const url = buildPublicUrl(req, req.file.filename);
    const result = await postImageService.updateInPost(postId, imageId, { url });

    res.status(HTTP.OK).json(result.postImage);
};

const deletePostImageFromPost = async (req, res) => {
    const postId = resolvePostId(req);
    const imageId = req.params.image_id ?? req.params.imageId;
    const result = await postImageService.removeFromPost(postId, imageId);

    res.status(HTTP.OK).json({
        message: res.__("delete_post_image_from_post", { imageId, postId }),
    });
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
