const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MovimientoInventario = sequelize.define(
  'MovimientoInventario',
  {
    id_movimiento_inventario: {
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
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    tipo_movimiento: {
      type: DataTypes.ENUM('INGRESO', 'SALIDA', 'AJUSTE'),
      allowNull: false,
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    motivo: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    referencia_tipo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    referencia_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    stock_anterior: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    stock_nuevo: {
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
    tableName: 'movimiento_inventario',
    timestamps: false,
  }
);

module.exports = MovimientoInventario;