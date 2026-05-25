const { Post, User, PostImage } = require("../db/models");
const { deleteFileFromUrl } = require("../helpers/fileHelper");

const postIncludes = [
  {
    model: User,
    as: "user",
    attributes: ["id", "nickname", "name", "lastName"],
  },
  { model: PostImage, as: "postImages" },
  {
    model: Tag,
    as: "tags",
    attributes: ["id", "name"],
    through: { attributes: [] }, // oculta columnas de la tabla intermedia
  },
];

const findUserOr404 = async (userId, res) => {
  const user = await User.findByPk(userId);
  if (!user) {
    res.status(404).json({ message: `Usuario con id ${userId} no encontrado` });
    return null;
  }
  return user;
};

const deletePostImagesAndFiles = async (postId) => {
  const images = await PostImage.findAll({ where: { postId } });
  for (const image of images) {
    deleteFileFromUrl(image.url);
    await image.destroy();
  }
};

const resolveTagInstances = async (tags = []) => {
  if (!Array.isArray(tags) || tags.length === 0) return [];
  const tagInstances = await Promise.all(
    tags.map((name) =>
      Tag.findOrCreate({
        where: { name: name.trim() },
        defaults: { name: name.trim() },
      }).then(([instance]) => instance),
    ),
  );
  return tagInstances;
};

const createPost = async (req, res) => {
  try {
    console.log("CREAR");
    const { description, publicationDate, user_id, tags } = req.body;

    const user = await findUserOr404(user_id, res);
    if (!user) return;

    const post = await Post.create({
      description,
      publicationDate,
      user_id,
    });

    const tagInstances = await resolveTagInstances(tags);
    if (tagInstances.length > 0) {
      await post.addTags(tagInstances);
    }

    const created = await Post.findByPk(post.id, { include: postIncludes });
    res.status(201).json(created);
  } catch (error) {
    res.status(500).json({
      message: "Error al crear el post",
      error: error.message,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.findAll({ include: postIncludes });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener los posts",
      error: error.message,
    });
  }
};

const getPostById = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id, { include: postIncludes });

    if (!post) {
      return res
        .status(404)
        .json({ message: `Post con id ${id} no encontrado` });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: "Error al obtener el post",
      error: error.message,
    });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const { tags } = req.body;
    const post = await Post.findByPk(id);

    if (!post) {
      return res
        .status(404)
        .json({ message: `Post con id ${id} no encontrado` });
    }

    if (req.body.userId) {
      const user = await findUserOr404(req.body.user_id, res);
      if (!user) return;
    }

    await post.update(req.body);

    if (tags !== undefined) {
      const tagInstances = await resolveTagInstances(tags);
      await post.setTags(tagInstances); // reemplaza la relación completa
    }

    const updated = await Post.findByPk(id, { include: postIncludes });
    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({
      message: "Error al actualizar el post",
      error: error.message,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await Post.findByPk(id);

    if (!post) {
      return res
        .status(404)
        .json({ message: `Post con id ${id} no encontrado` });
    }

    await deletePostImagesAndFiles(id);
    await post.destroy();

    res
      .status(200)
      .json({ message: `Post con id ${id} eliminado correctamente` });
  } catch (error) {
    res.status(500).json({
      message: "Error al eliminar el post",
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
