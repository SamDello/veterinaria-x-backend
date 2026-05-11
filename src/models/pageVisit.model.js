const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PageVisit = sequelize.define(
  'PageVisit',
  {
    id_page_visit: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    page_key: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    total_visits: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    last_visit_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'page_visits',
    timestamps: false,
  }
);

module.exports = PageVisit;