"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("PostTags", {
      post_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Posts", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: "Tags", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
    await queryInterface.addConstraint("PostTags", {
      fields: ["post_id", "tag_id"],
      type: "unique",
      name: "post_tags_post_id_tag_id_unique",
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable("PostTags");
  },
};
