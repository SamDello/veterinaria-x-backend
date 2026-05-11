const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetalleCompra = sequelize.define(
  'DetalleCompra',
  {
    id_detalle_compra: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_compra: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    costo_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    subtotal: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'detalle_compra',
    timestamps: false,
  }
);

module.exports = DetalleCompra;