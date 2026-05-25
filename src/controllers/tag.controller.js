const { Tag, Post } = require("../db/models");

const tagIncludes = [
  {
    model: Post,
    as: "posts",
    attributes: ["id", "description", "createdAt"],
    through: { attributes: [] },
  },
];

const createTag = async (req, res) => {
  const { name } = req.body;
  const tag = await Tag.create({ name });
  res.status(201).json(tag);
};

const getAllTags = async (req, res) => {
  const tags = await Tag.findAll();
  res.status(200).json(tags);
};

const getTagById = async (req, res) => {
  const { id } = req.params;
  const tag = await Tag.findByPk(id, { include: tagIncludes });

  res.status(200).json(tag);
};

const updateTag = async (req, res) => {
  const { id } = req.params;
  const tag = await Tag.findByPk(id);

  await tag.update(req.body);
  res.status(200).json(tag);
};

const deleteTag = async (req, res) => {
  const { id } = req.params;
  const tag = await Tag.findByPk(id);
  await tag.destroy();
  res.status(200).json({ message: `Tag con id ${id} eliminado correctamente` });
};
module.exports = {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
};
