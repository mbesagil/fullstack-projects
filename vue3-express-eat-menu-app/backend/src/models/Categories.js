const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/Psql");
const { v4: uuidv4 } = require("uuid");
const Users = require("./Users");
const Companies = require("./Companies");
const Categories = sequelize.define(
  "Categories",
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
    content: {
      type: Sequelize.STRING,
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
    tableName: "Categories",
  }
);

Users.hasMany(Categories);
Categories.belongsTo(Users, { foreignKey: "user_id", as: "user" });

Companies.hasMany(Categories);
Categories.belongsTo(Companies, { foreignKey: "company_id", as: "company" });
// Categories.sync({ force: true });
// Categories.sync();

module.exports = Categories;
