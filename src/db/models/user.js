"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class User extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            (User.hasMany(models.Post, { foreignKey: "userId", as: "posts" }),
                User.hasMany(models.Comment, { foreignKey: "commentId", as: "comments" }));
        }
    }
    User.init(
        {
            //  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
            nickname: { type: DataTypes.STRING, unique: true, allowNull: false },
            name: { type: DataTypes.STRING, allowNull: false },
            lastName: { type: DataTypes.STRING, allowNull: false },
            email: { type: DataTypes.STRING, unique: true, allowNull: false },
            password: { type: DataTypes.STRING, allowNull: false },
            birthDate: { type: DataTypes.DATE, allowNull: false },
            gender: { type: DataTypes.STRING, allowNull: false },
            createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
            updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
        },
        { sequelize, modelName: "User" },
    );
    return User;
};
