const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const DetalleVentaServicio = sequelize.define(
  'DetalleVentaServicio',
  {
    id_detalle_venta_servicio: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_venta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_servicio: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
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
    tableName: 'detalle_venta_servicio',
    timestamps: false,
  }
);

module.exports = DetalleVentaServicio;