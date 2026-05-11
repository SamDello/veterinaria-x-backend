const { DataTypes } = require('sequelize');
const db = require('../config/database');

const sequelize = db.sequelize || db;

const Traspaso = sequelize.define(
  'Traspaso',
  {
    id_traspaso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    id_almacen_origen: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    id_almacen_destino: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },

    observacion: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    estado: {
      type: DataTypes.ENUM('REGISTRADO', 'ANULADO'),
      allowNull: false,
      defaultValue: 'REGISTRADO'
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
    tableName: 'traspaso',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
  }
);

module.exports = Traspaso;