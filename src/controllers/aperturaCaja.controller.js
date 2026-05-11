const { AperturaCaja, Caja, Empleado } = require('../models');

async function createAperturaCaja(req, res) {
  try {
    const { id_caja, id_empleado, monto_inicial } = req.body;

    const caja = await Caja.findByPk(id_caja);
    if (!caja) {
      return res.status(404).json({
        ok: false,
        message: 'Caja no encontrada.',
      });
    }

    if (!caja.estado) {
      return res.status(400).json({
        ok: false,
        message: 'La caja seleccionada se encuentra inactiva.',
      });
    }

    const empleado = await Empleado.findByPk(id_empleado);
    if (!empleado) {
      return res.status(404).json({
        ok: false,
        message: 'Empleado no encontrado.',
      });
    }

    const aperturaPendiente = await AperturaCaja.findOne({
      where: {
        id_caja,
        estado: 'ABIERTA',
      },
    });

    if (aperturaPendiente) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe una apertura activa para esta caja.',
      });
    }

    const apertura = await AperturaCaja.create({
      id_caja,
      id_empleado,
      monto_inicial,
      estado: 'ABIERTA',
    });

    const aperturaCreada = await AperturaCaja.findByPk(apertura.id_apertura_caja, {
      include: [
        { model: Caja, as: 'caja' },
        { model: Empleado, as: 'empleado' },
      ],
    });

    return res.status(201).json({
      ok: true,
      message: 'Apertura de caja registrada correctamente.',
      data: aperturaCreada,
    });
  } catch (error) {
    console.error('ERROR CREATE APERTURA CAJA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar apertura de caja.',
      error: error.message,
    });
  }
}

async function getAperturasCaja(req, res) {
  try {
    const aperturas = await AperturaCaja.findAll({
      include: [
        { model: Caja, as: 'caja' },
        { model: Empleado, as: 'empleado' },
      ],
      order: [['id_apertura_caja', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: aperturas,
    });
  } catch (error) {
    console.error('ERROR GET APERTURAS CAJA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar aperturas de caja.',
      error: error.message,
    });
  }
}

async function getAperturaCajaById(req, res) {
  try {
    const { id } = req.params;

    const apertura = await AperturaCaja.findByPk(id, {
      include: [
        { model: Caja, as: 'caja' },
        { model: Empleado, as: 'empleado' },
      ],
    });

    if (!apertura) {
      return res.status(404).json({
        ok: false,
        message: 'Apertura de caja no encontrada.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: apertura,
    });
  } catch (error) {
    console.error('ERROR GET APERTURA CAJA BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener apertura de caja.',
      error: error.message,
    });
  }
}

module.exports = {
  createAperturaCaja,
  getAperturasCaja,
  getAperturaCajaById,
};