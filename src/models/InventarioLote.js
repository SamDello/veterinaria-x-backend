const { DataTypes } = require('sequelize');
const db = require('../config/database');

const sequelize = db.sequelize || db;

const InventarioLote = sequelize.define(
  'InventarioLote',
  {
    id_lote: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    id_almacen: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    id_compra: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    id_detalle_compra: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    id_traspaso: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    id_traspaso_detalle: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    codigo_lote: {
      type: DataTypes.STRING(100),
      allowNull: true
    },

    fecha_ingreso: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },

    fecha_vencimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true
    },

    cantidad_inicial: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },

    cantidad_disponible: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },

    costo_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },

    estado: {
      type: DataTypes.ENUM('DISPONIBLE', 'AGOTADO', 'ANULADO'),
      allowNull: false,
      defaultValue: 'DISPONIBLE'
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
    tableName: 'inventario_lote',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
  }
);

module.exports = InventarioLote;