const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PagoQrLibelula = sequelize.define(
  'PagoQrLibelula',
  {
    id_pago_qr_libelula: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_pago: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    id_venta: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    identificador_deuda: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
    },
    codigo_transaccion_libelula: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    appkey: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    payment_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    qr_url: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    qr_base64: {
      type: DataTypes.TEXT('long'),
      allowNull: true,
    },
    estado_libelula: {
      type: DataTypes.ENUM(
        'PENDIENTE',
        'GENERADO',
        'PAGADO',
        'VENCIDO',
        'ANULADO',
        'ERROR'
      ),
      allowNull: false,
      defaultValue: 'PENDIENTE',
    },
    monto_solicitado: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    moneda: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: 'BOB',
    },
    fecha_expiracion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    respuesta_creacion: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    respuesta_consulta: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    respuesta_callback: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    observacion: {
      type: DataTypes.STRING(255),
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
    tableName: 'pago_qr_libelula',
    timestamps: false,
  }
);

module.exports = PagoQrLibelula;