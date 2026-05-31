"use strict";

const describeTableSafe = async (queryInterface, tableName) => {
  try {
    return await queryInterface.describeTable(tableName);
  } catch {
    return null;
  }
};

const renameColumnIfExists = async (
  queryInterface,
  tableName,
  from,
  to,
  table,
) => {
  if (table[from] && !table[to]) {
    await queryInterface.renameColumn(tableName, from, to);
    return await describeTableSafe(queryInterface, tableName);
  }
  return table;
};

const removeColumnIfExists = async (queryInterface, tableName, column, table) => {
  if (table[column]) {
    await queryInterface.removeColumn(tableName, column);
    return await describeTableSafe(queryInterface, tableName);
  }
  return table;
};

const addUniqueIndexIfMissing = async (queryInterface, tableName, fields, indexName) => {
  const indexes = await queryInterface.showIndex(tableName).catch(() => []);
  const exists = indexes.some((idx) => idx.name === indexName);
  if (!exists) {
    await queryInterface.addIndex(tableName, fields, {
      unique: true,
      name: indexName,
    });
  }
};

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let users = await describeTableSafe(queryInterface, "Users");
    if (users) {
      users = await renameColumnIfExists(
        queryInterface,
        "Users",
        "nickName",
        "nickname",
        users,
      );
    }

    let posts = await describeTableSafe(queryInterface, "Posts");
    if (posts) {
      posts = await renameColumnIfExists(
        queryInterface,
        "Posts",
        "userId",
        "user_id",
        posts,
      );
      posts = await removeColumnIfExists(
        queryInterface,
        "Posts",
        "publicationDate",
        posts,
      );
    }

    let postImages = await describeTableSafe(queryInterface, "PostImages");
    if (postImages) {
      postImages = await renameColumnIfExists(
        queryInterface,
        "PostImages",
        "postId",
        "post_id",
        postImages,
      );
    }

    let comments = await describeTableSafe(queryInterface, "Comments");
    if (comments) {
      comments = await renameColumnIfExists(
        queryInterface,
        "Comments",
        "userId",
        "user_id",
        comments,
      );
      comments = await renameColumnIfExists(
        queryInterface,
        "Comments",
        "postId",
        "post_id",
        comments,
      );
      comments = await removeColumnIfExists(
        queryInterface,
        "Comments",
        "commentDate",
        comments,
      );
      comments = await removeColumnIfExists(
        queryInterface,
        "Comments",
        "isVisible",
        comments,
      );
    }

    const tags = await describeTableSafe(queryInterface, "Tags");
    if (tags) {
      await addUniqueIndexIfMissing(queryInterface, "Tags", ["name"], "tags_name_unique");
    }
  },

  async down(queryInterface) {
    const tags = await describeTableSafe(queryInterface, "Tags");
    if (tags) {
      await queryInterface.removeIndex("Tags", "tags_name_unique").catch(() => {});
    }
  },
};
