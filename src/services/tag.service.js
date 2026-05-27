const { Tag, Post } = require("../db/models");

const tagIncludes = [
  {
    model: Post,
    as: "posts",
    attributes: ["id", "description"],
    through: { attributes: [] },
  },
];

const findAll = () => Tag.findAll({ include: tagIncludes });

const findById = (id) => Tag.findByPk(id, { include: tagIncludes });

const create = async ({ name }) => {
  const tag = await Tag.create({ name });
  return Tag.findByPk(tag.id, { include: tagIncludes });
};

const update = async (id, { name }) => {
  const tag = await Tag.findByPk(id);

  if (!tag) return null;
  if (name === undefined) return { empty: true };

  await tag.update({ name });

  return Tag.findByPk(id, { include: tagIncludes });
};

const remove = async (id) => {
  const tag = await Tag.findByPk(id);

  if (!tag) return false;

  await tag.destroy();

  return true;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
};
