const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const AtencionVeterinaria = sequelize.define(
  'AtencionVeterinaria',
  {
    id_atencion: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_mascota: {
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
    motivo_consulta: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    diagnostico: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    tratamiento: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    observaciones: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    peso: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    temperatura: {
      type: DataTypes.DECIMAL(4, 1),
      allowNull: true,
    },
    total_servicios: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    estado_cobro: {
      type: DataTypes.ENUM('PENDIENTE', 'PAGADO', 'ANULADO'),
      allowNull: false,
      defaultValue: 'PENDIENTE',
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
    tableName: 'atencion_veterinaria',
    timestamps: false,
  }
);

module.exports = AtencionVeterinaria;