const { Caja } = require('../models');

async function createCaja(req, res) {
  try {
    const { nombre, descripcion, ubicacion } = req.body;

    const existe = await Caja.findOne({ where: { nombre } });
    if (existe) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe una caja con ese nombre.',
      });
    }

    const caja = await Caja.create({
      nombre,
      descripcion: descripcion || null,
      ubicacion: ubicacion || null,
      estado: true,
    });

    return res.status(201).json({
      ok: true,
      message: 'Caja registrada correctamente.',
      data: caja,
    });
  } catch (error) {
    console.error('ERROR CREATE CAJA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar caja.',
      error: error.message,
    });
  }
}

async function getCajas(req, res) {
  try {
    const cajas = await Caja.findAll({
      order: [['id_caja', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: cajas,
    });
  } catch (error) {
    console.error('ERROR GET CAJAS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar cajas.',
      error: error.message,
    });
  }
}

async function getCajaById(req, res) {
  try {
    const { id } = req.params;

    const caja = await Caja.findByPk(id);

    if (!caja) {
      return res.status(404).json({
        ok: false,
        message: 'Caja no encontrada.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: caja,
    });
  } catch (error) {
    console.error('ERROR GET CAJA BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener caja.',
      error: error.message,
    });
  }
}

async function updateCaja(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion, ubicacion } = req.body;

    const caja = await Caja.findByPk(id);

    if (!caja) {
      return res.status(404).json({
        ok: false,
        message: 'Caja no encontrada.',
      });
    }

    const existe = await Caja.findOne({ where: { nombre } });

    if (existe && existe.id_caja !== caja.id_caja) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe una caja con ese nombre.',
      });
    }

    await caja.update({
      nombre,
      descripcion: descripcion || null,
      ubicacion: ubicacion || null,
    });

    return res.status(200).json({
      ok: true,
      message: 'Caja actualizada correctamente.',
      data: caja,
    });
  } catch (error) {
    console.error('ERROR UPDATE CAJA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar caja.',
      error: error.message,
    });
  }
}

async function changeCajaStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const caja = await Caja.findByPk(id);

    if (!caja) {
      return res.status(404).json({
        ok: false,
        message: 'Caja no encontrada.',
      });
    }

    await caja.update({ estado });

    return res.status(200).json({
      ok: true,
      message: 'Estado de la caja actualizado correctamente.',
      data: caja,
    });
  } catch (error) {
    console.error('ERROR CHANGE CAJA STATUS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar estado de la caja.',
      error: error.message,
    });
  }
}

module.exports = {
  createCaja,
  getCajas,
  getCajaById,
  updateCaja,
  changeCajaStatus,
};