const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Empleado = sequelize.define(
  'Empleado',
  {
    id_empleado: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      unique: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    ci: {
      type: DataTypes.STRING(30),
      allowNull: true,
      unique: true,
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    direccion: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    cargo: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    especialidad: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    estado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    tableName: 'empleado',
    timestamps: false,
  }
);

module.exports = Empleado;