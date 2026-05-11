const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetalleVentaProducto = sequelize.define(
  'DetalleVentaProducto',
  {
    id_detalle_venta_producto: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_venta: {
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
    precio_unitario: {
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
    tableName: 'detalle_venta_producto',
    timestamps: false,
  }
);

module.exports = DetalleVentaProducto;