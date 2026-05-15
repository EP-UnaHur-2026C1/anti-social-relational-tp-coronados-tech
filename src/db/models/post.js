"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            (Post.belongsTo(models.User, { foreignKey: "userId", as: "user" }),
                Post.hasMany(models.Comment, { foreignKey: "commentId", as: "comments" }),
                Post.hasMany(models.PostImage, { foreignKey: "postImageId", as: "postImages" }),
                Post.hasMany(models.Tag, { foreignKey: "tagId", as: "tags" }));
        }
    }
    Post.init(
        {
            //id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            description: { type: DataTypes.TEXT, allowNull: false },
            publicationDate: { type: DataTypes.DATE, allowNull: false },
            userId: { type: DataTypes.INTEGER, allowNull: false },
            createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
            updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        },
        {
            sequelize,
            modelName: "Post",
        },
    );
    return Post;
};
