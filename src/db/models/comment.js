"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Comment extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Comment.belongsTo(models.User, { foreignKey: "userId", as: "user" });
            Comment.belongsTo(models.Post, { foreignKey: "postId", as: "post" });
        }
    }
    Comment.init(
        {
            //id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            content: { type: DataTypes.TEXT, allowNull: false },
            isVisible: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
            userId: { type: DataTypes.INTEGER, allowNull: false },
            postId: { type: DataTypes.INTEGER, allowNull: false },
            createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
            updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        },
        { sequelize, modelName: "Comment" },
    );
    return Comment;
};
