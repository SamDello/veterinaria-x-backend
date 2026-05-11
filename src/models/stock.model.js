const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Stock = sequelize.define(
  'Stock',
  {
    id_stock: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_almacen: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    stock_actual: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    stock_minimo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    stock_maximo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
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
    tableName: 'stock',
    timestamps: false,
  }
);

module.exports = Stock;