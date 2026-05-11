const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AtencionServicio = sequelize.define(
  'AtencionServicio',
  {
    id_atencion_servicio: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_atencion: {
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
    observacion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'atencion_servicio',
    timestamps: false,
  }
);

module.exports = AtencionServicio;