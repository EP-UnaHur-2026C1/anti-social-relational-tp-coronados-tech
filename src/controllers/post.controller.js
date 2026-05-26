const HTTP = require("../config/HttpCode");
const postService = require("../services/post.service");

const notFoundPost = (res, id) =>
  res.status(HTTP.NOT_FOUND).json({
    message: res.__("id_dont_exist", { id, nombreModelo: "Post" }),
  });

const createPost = async (req, res) => {
  try {
    const { description, user_id } = req.body;
    const created = await postService.create({ description, user_id });
    res.status(HTTP.CREATED).json(created);
  } catch (error) {
    res.status(HTTP.BAD_REQUEST).json({
      message: res.__("error_create_post"),
      error: error.message,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.findAll();
    res.status(HTTP.OK).json(posts);
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: res.__("error_get_posts"),
      error: error.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postService.findById(id);

    if (!post) {
      return notFoundPost(res, id);
    }

    res.status(HTTP.OK).json(post);
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: res.__("error_get_post"),
      error: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await postService.update(id, req.body);

    if (!updated) {
      return notFoundPost(res, id);
    }

    if (updated.empty) {
      return res.status(HTTP.BAD_REQUEST).json({
        errores: [
          {
            atributo: "body",
            error: res.__("update_post_no_fields"),
          },
        ],
      });
    }

    res.status(HTTP.OK).json(updated);
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: res.__("error_update_post"),
      error: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await postService.remove(id);

    if (!deleted) {
      return notFoundPost(res, id);
    }

    res.status(HTTP.OK).json({
      message: res.__("delete_post", { id }),
    });
  } catch (error) {
    res.status(HTTP.INTERNAL_SERVER_ERROR).json({
      message: res.__("error_delete_post"),
      error: error.message,
    });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
};
