const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cliente = sequelize.define(
  'Cliente',
  {
    id_cliente: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    apellidos: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    ci_nit: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    correo: {
      type: DataTypes.STRING(150),
      allowNull: true,
      validate: {
        isEmail: true,
      },
    },
    direccion: {
      type: DataTypes.STRING(255),
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
    tableName: 'cliente',
    timestamps: false,
  }
);

module.exports = Cliente;