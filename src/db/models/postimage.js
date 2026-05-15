"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class PostImage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            PostImage.belongsTo(models.Post, { foreignKey: "postId", as: "post" });
        }
    }
    PostImage.init(
        {
            //id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            url: { type: DataTypes.STRING, allowNull: false },
            postId: { type: DataTypes.INTEGER, allowNull: false },
            createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
            updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        },
        {
            sequelize,
            modelName: "PostImage",
        },
    );
    return PostImage;
};
