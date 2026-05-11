const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mascota = sequelize.define(
  'Mascota',
  {
    id_mascota: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_raza: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    sexo: {
      type: DataTypes.ENUM('M', 'F'),
      allowNull: true,
    },
    fecha_nacimiento: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    peso: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    observaciones: {
      type: DataTypes.TEXT,
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
        imagen_url: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    imagen_public_id: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'mascota',
    timestamps: false,
  }

  
);

module.exports = Mascota;