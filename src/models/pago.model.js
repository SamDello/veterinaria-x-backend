const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Pago = sequelize.define(
  'Pago',
  {
    id_pago: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_venta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    estado: {
      type: DataTypes.ENUM('PENDIENTE', 'PAGADO', 'ANULADO', 'EXPIRADO'),
      allowNull: false,
      defaultValue: 'PENDIENTE',
    },
    observacion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    referencia_externa: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    fecha_confirmacion: {
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
    tableName: 'pago',
    timestamps: false,
  }
);

module.exports = Pago;