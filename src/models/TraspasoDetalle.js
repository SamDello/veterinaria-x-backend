const { DataTypes } = require('sequelize');
const db = require('../config/database');

const sequelize = db.sequelize || db;

const TraspasoDetalle = sequelize.define(
  'TraspasoDetalle',
  {
    id_traspaso_detalle: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    id_traspaso: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    cantidad: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },

    costo_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: true
    }
  },
  {
    tableName: 'traspaso_detalle',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
  }
);

module.exports = TraspasoDetalle;