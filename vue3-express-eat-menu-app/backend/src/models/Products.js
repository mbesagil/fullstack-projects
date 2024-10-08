const { Sequelize, DataTypes } = require("sequelize");
const { sequelize } = require("../config/Psql");
const { v4: uuidv4 } = require("uuid");
const Users = require("./Users");
const Categories = require("./Categories");
const Companies = require("./Companies");
const Products = sequelize.define(
  "Products",
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
    tableName: "Products",
  }
);

// Users.hasMany(Products);
Products.belongsTo(Users, { foreignKey: "user_id", as: "user" });

// Companies.hasMany(Products);
Products.belongsTo(Companies, { foreignKey: "company_id", as: "company" });

// Categories.hasMany(Products);
Products.belongsTo(Categories, { foreignKey: "category_id", as: "category" });

// Products.sync({ force: true });
// Products.sync();

module.exports = Products;
