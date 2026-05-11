const { DataTypes } = require('sequelize');
const db = require('../config/database');

const sequelize = db.sequelize || db;

const InventarioLoteMovimiento = sequelize.define(
  'InventarioLoteMovimiento',
  {
    id_lote_movimiento: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },

    id_lote: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    id_producto: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

    id_almacen_origen: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    id_almacen_destino: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    tipo: {
      type: DataTypes.ENUM(
        'ENTRADA_COMPRA',
        'SALIDA_VENTA',
        'TRASPASO_SALIDA',
        'TRASPASO_ENTRADA',
        'AJUSTE_ENTRADA',
        'AJUSTE_SALIDA'
      ),
      allowNull: false
    },

    cantidad: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },

    costo_unitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },

    costo_total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    },

    stock_lote_anterior: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },

    stock_lote_nuevo: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true
    },

    referencia_tipo: {
      type: DataTypes.STRING(50),
      allowNull: true
    },

    referencia_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

    observacion: {
      type: DataTypes.TEXT,
      allowNull: true
    },

    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
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
    tableName: 'inventario_lote_movimiento',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    freezeTableName: true
  }
);

module.exports = InventarioLoteMovimiento;