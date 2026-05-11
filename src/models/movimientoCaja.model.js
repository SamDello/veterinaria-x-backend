const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MovimientoCaja = sequelize.define(
  'MovimientoCaja',
  {
    id_movimiento_caja: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_apertura_caja: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_empleado: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_metodo_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_pago: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    tipo_movimiento: {
      type: DataTypes.ENUM('INGRESO', 'EGRESO'),
      allowNull: false,
    },
    monto: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    observacion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    referencia_tipo: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    referencia_id: {
      type: DataTypes.INTEGER,
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
    tableName: 'movimiento_caja',
    timestamps: false,
  }
);

module.exports = MovimientoCaja;