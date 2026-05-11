const {
  CierreCaja,
  AperturaCaja,
  Caja,
  Empleado,
} = require('../models');

async function createCierreCaja(req, res) {
  try {
    const { id_apertura_caja, id_empleado, monto_final, observacion } = req.body;

    const apertura = await AperturaCaja.findByPk(id_apertura_caja, {
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

    if (apertura.estado !== 'ABIERTA') {
      return res.status(400).json({
        ok: false,
        message: 'La apertura seleccionada ya no está abierta.',
      });
    }

    const empleado = await Empleado.findByPk(id_empleado);
    if (!empleado) {
      return res.status(404).json({
        ok: false,
        message: 'Empleado no encontrado.',
      });
    }

    const cierreExistente = await CierreCaja.findOne({
      where: { id_apertura_caja },
    });

    if (cierreExistente) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un cierre registrado para esta apertura de caja.',
      });
    }

    const cierre = await CierreCaja.create({
      id_apertura_caja,
      id_empleado,
      monto_final,
      observacion: observacion || null,
    });

    await apertura.update({
      estado: 'CERRADA',
    });

    const cierreCreado = await CierreCaja.findByPk(cierre.id_cierre_caja, {
      include: [
        {
          model: AperturaCaja,
          as: 'apertura',
          include: [
            { model: Caja, as: 'caja' },
            { model: Empleado, as: 'empleado' },
          ],
        },
        {
          model: Empleado,
          as: 'empleado',
        },
      ],
    });

    return res.status(201).json({
      ok: true,
      message: 'Cierre de caja registrado correctamente.',
      data: cierreCreado,
    });
  } catch (error) {
    console.error('ERROR CREATE CIERRE CAJA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar cierre de caja.',
      error: error.message,
    });
  }
}

async function getCierresCaja(req, res) {
  try {
    const cierres = await CierreCaja.findAll({
      include: [
        {
          model: AperturaCaja,
          as: 'apertura',
          include: [
            { model: Caja, as: 'caja' },
            { model: Empleado, as: 'empleado' },
          ],
        },
        {
          model: Empleado,
          as: 'empleado',
        },
      ],
      order: [['id_cierre_caja', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: cierres,
    });
  } catch (error) {
    console.error('ERROR GET CIERRES CAJA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar cierres de caja.',
      error: error.message,
    });
  }
}

async function getCierreCajaById(req, res) {
  try {
    const { id } = req.params;

    const cierre = await CierreCaja.findByPk(id, {
      include: [
        {
          model: AperturaCaja,
          as: 'apertura',
          include: [
            { model: Caja, as: 'caja' },
            { model: Empleado, as: 'empleado' },
          ],
        },
        {
          model: Empleado,
          as: 'empleado',
        },
      ],
    });

    if (!cierre) {
      return res.status(404).json({
        ok: false,
        message: 'Cierre de caja no encontrado.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: cierre,
    });
  } catch (error) {
    console.error('ERROR GET CIERRE CAJA BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener cierre de caja.',
      error: error.message,
    });
  }
}

module.exports = {
  createCierreCaja,
  getCierresCaja,
  getCierreCajaById,
};