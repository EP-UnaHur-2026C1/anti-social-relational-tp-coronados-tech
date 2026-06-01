"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.hasMany(models.Post, { foreignKey: "user_id", as: "posts" });
      User.hasMany(models.Comment, { foreignKey: "user_id", as: "comments" });
      //mis seguidores
      User.belongsToMany(models.User, {
        through: "Followers",      // Nombre de la tabla intermedia
        as: "followers",           // Alias para acceder: usuario.followers
        foreignKey: "following_id", // Clave de la persona a la que siguen
        otherKey: "follower_id"    // Clave de la persona que sigue
      });
      //mis seguidos
      User.belongsToMany(models.User, {
        through: "Followers",      // Misma tabla intermedia
        as: "following",           // Alias para acceder: usuario.following
        foreignKey: "follower_id", // Clave de la persona que sigue
        otherKey: "following_id"   // Clave de la persona a la que siguen
      });
    }

    toJSON() {
      const attributes = [
        "id",
        "nickname",
        "name",
        "lastName",
        "email",
        "birthDate",
        "gender",
        "createdAt",
        "updatedAt",
      ];
      const values = {};

      for (const attribute of attributes) {
        const value = this.get(attribute);
        if (value !== undefined) {
          values[attribute] = value;
        }
      }

      for (const association of ["followers", "following", "posts", "comments"]) {
        if (this[association] !== undefined) {
          values[association] = this[association];
        }
      }

      return values;
    }
  }
  User.init(
    {
      nickname: { type: DataTypes.STRING, unique: true, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: false },
      email: { type: DataTypes.STRING, unique: true, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      birthDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        get() {
          const value = this.getDataValue("birthDate");
          if (!value) return null;
          if (typeof value === "string") return value.slice(0, 10);
          return value.toISOString().slice(0, 10);
        },
      },
      gender: { type: DataTypes.STRING, allowNull: false },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
      },
    },
    { sequelize, modelName: "User" },
  );
  return User;
};
