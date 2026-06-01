const { Tag, Post } = require("../db/models");

const tagIncludes = [
  {
    model: Post,
    as: "posts",
    attributes: ["id", "description"],
    through: { attributes: [] },
  },
];

const findAll = ({ post_id } = {}) => {
  const postsInclude = {
    model: Post,
    as: "posts",
    attributes: ["id", "description"],
    through: { attributes: [] },
  };

  if (post_id !== undefined) {
    postsInclude.where = { id: post_id };
    postsInclude.required = true;
  }

  return Tag.findAll({ include: [postsInclude] });
};

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
