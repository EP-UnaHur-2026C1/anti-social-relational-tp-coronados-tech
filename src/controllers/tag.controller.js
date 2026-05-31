const HTTP = require("../config/HttpCode");

const tagService = require("../services/tag.service");

const createTag = async (req, res) => {
  const { name } = req.body;
  const tag = await tagService.create({ name });
  res.status(HTTP.CREATED).json(tag);
};

const getAllTags = async (req, res) => {
  const tags = await tagService.findAll();
  res.status(HTTP.OK).json(tags);
};

const getTagById = async (req, res) => {
  const { id } = req.params;
  const tag = await tagService.findByPk(id);

  res.status(HTTP.OK).json(tag);
};

const updateTag = async (req, res) => {
  const { id } = req.params;
  const updatedTag = await tagService.update(id, req.body);

  res.status(HTTP.OK).json(updatedTag);
};

const deleteTag = async (req, res) => {
  const { id } = req.params;
  await tagService.remove(id);
  res.status(200).json({ message: `Tag con id ${id} eliminado correctamente` });
};
module.exports = {
  createTag,
  getAllTags,
  getTagById,
  updateTag,
  deleteTag,
};
