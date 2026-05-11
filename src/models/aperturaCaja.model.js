const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AperturaCaja = sequelize.define(
  'AperturaCaja',
  {
    id_apertura_caja: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_caja: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_apertura: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    monto_inicial: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    estado: {
      type: DataTypes.ENUM('ABIERTA', 'CERRADA'),
      allowNull: false,
      defaultValue: 'ABIERTA',
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
    tableName: 'apertura_caja',
    timestamps: false,
  }
);

module.exports = AperturaCaja;