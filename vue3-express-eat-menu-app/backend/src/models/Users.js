const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/Psql");
const { v4: uuidv4 } = require("uuid");
const Users = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    surname: {
      type: Sequelize.STRING,
    },
    avatar: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
    },
    extras: {
      type: DataTypes.ARRAY(DataTypes.JSON),
    },
  },
  {
    underscoredAll: true,
    freezeTableName: true,
    tableName: "users",
  }
);

// Users.sync({ force: true });
// Users.sync({ alter: true });

module.exports = Users;
