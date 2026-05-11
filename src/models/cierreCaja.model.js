const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CierreCaja = sequelize.define(
  'CierreCaja',
  {
    id_cierre_caja: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_apertura_caja: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fecha_cierre: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    monto_final: {
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
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'cierre_caja',
    timestamps: false,
  }
);

module.exports = CierreCaja;