const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/Psql");
const { v4: uuidv4 } = require("uuid");
const Users = require("./Users");
const Companies = sequelize.define(
  "Companies",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: () => uuidv4(),
      allowNull: false,
      autoIncrement: false,
      primaryKey: true,
    },
    title: {
      type: Sequelize.STRING,
    },
    description: {
      type: Sequelize.STRING,
    },
    tax_id: {
      type: Sequelize.STRING,
    },
    tax_office: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    content: {
      type: Sequelize.STRING,
    },
    icon: {
      type: Sequelize.JSON,
    },
    images: {
      type: Sequelize.ARRAY(DataTypes.JSON),
    },
    extras: {
      type: DataTypes.ARRAY(DataTypes.JSON),
    },
  },
  {
    underscoredAll: true,
    freezeTableName: true,
    tableName: "Companies",
  }
);

Users.hasMany(Companies);
Companies.belongsTo(Users, { foreignKey: "user_id", as: "user" });

Companies.sync({ alter: true });
// Companies.sync();

module.exports = Companies;
