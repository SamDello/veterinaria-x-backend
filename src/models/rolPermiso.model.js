const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RolPermiso = sequelize.define(
  'RolPermiso',
  {
    id_rol_permiso: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_rol: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_permiso: {
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
    tableName: 'rol_permiso',
    timestamps: false,
  }
);

module.exports = RolPermiso;