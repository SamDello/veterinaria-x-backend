const { MetodoPago } = require('../models');

async function createMetodoPago(req, res) {
  try {
    const { nombre, descripcion } = req.body;

    const existe = await MetodoPago.findOne({ where: { nombre } });
    if (existe) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un metodo de pago con ese nombre.',
      });
    }

    const metodoPago = await MetodoPago.create({
      nombre,
      descripcion: descripcion || null,
      estado: true,
    });

    return res.status(201).json({
      ok: true,
      message: 'Metodo de pago registrado correctamente.',
      data: metodoPago,
    });
  } catch (error) {
    console.error('ERROR CREATE METODO PAGO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar metodo de pago.',
      error: error.message,
    });
  }
}

async function getMetodosPago(req, res) {
  try {
    const metodosPago = await MetodoPago.findAll({
      order: [['id_metodo_pago', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: metodosPago,
    });
  } catch (error) {
    console.error('ERROR GET METODOS PAGO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar metodos de pago.',
      error: error.message,
    });
  }
}

async function changeMetodoPagoStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const metodoPago = await MetodoPago.findByPk(id);

    if (!metodoPago) {
      return res.status(404).json({
        ok: false,
        message: 'Método de pago no encontrado.',
      });
    }

    await metodoPago.update({ estado });

    return res.status(200).json({
      ok: true,
      message: 'Estado del método de pago actualizado correctamente.',
      data: metodoPago,
    });
  } catch (error) {
    console.error('ERROR CHANGE METODO PAGO STATUS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar estado del método de pago.',
      error: error.message,
    });
  }
}

async function getMetodoPagoById(req, res) {
  try {
    const { id } = req.params;

    const metodoPago = await MetodoPago.findByPk(id);

    if (!metodoPago) {
      return res.status(404).json({
        ok: false,
        message: 'Metodo de pago no encontrado.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: metodoPago,
    });
  } catch (error) {
    console.error('ERROR GET METODO PAGO BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener metodo de pago.',
      error: error.message,
    });
  }
}

async function updateMetodoPago(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const metodoPago = await MetodoPago.findByPk(id);

    if (!metodoPago) {
      return res.status(404).json({
        ok: false,
        message: 'Metodo de pago no encontrado.',
      });
    }

    const existe = await MetodoPago.findOne({
      where: { nombre }
    });

    if (existe && existe.id_metodo_pago !== metodoPago.id_metodo_pago) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un metodo de pago con ese nombre.',
      });
    }

    await metodoPago.update({
      nombre,
      descripcion: descripcion || null,
    });

    return res.status(200).json({
      ok: true,
      message: 'Metodo de pago actualizado correctamente.',
      data: metodoPago,
    });
  } catch (error) {
    console.error('ERROR UPDATE METODO PAGO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar metodo de pago.',
      error: error.message,
    });
  }
}

module.exports = {
  createMetodoPago,
  getMetodosPago,
  getMetodoPagoById,
  updateMetodoPago,
  changeMetodoPagoStatus,
};