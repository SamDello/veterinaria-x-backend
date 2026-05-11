const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UsuarioRol = sequelize.define(
  'UsuarioRol',
  {
    id_usuario_rol: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: 'usuario_rol',
    timestamps: false,
  }
);

module.exports = UsuarioRol;