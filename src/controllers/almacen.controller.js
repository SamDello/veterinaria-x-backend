const { Almacen } = require('../models');

async function createAlmacen(req, res) {
  try {
    const { nombre, ubicacion, descripcion } = req.body;

    const existe = await Almacen.findOne({ where: { nombre } });
    if (existe) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un almacén con ese nombre.',
      });
    }

    const almacen = await Almacen.create({
      nombre,
      ubicacion: ubicacion || null,
      descripcion: descripcion || null,
      estado: true,
    });

    return res.status(201).json({
      ok: true,
      message: 'Almacén registrado correctamente.',
      data: almacen,
    });
  } catch (error) {
    console.error('ERROR CREATE ALMACEN:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar almacén.',
      error: error.message,
    });
  }
}

async function getAlmacenes(req, res) {
  try {
    const almacenes = await Almacen.findAll({
      order: [['id_almacen', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: almacenes,
    });
  } catch (error) {
    console.error('ERROR GET ALMACENES:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar almacenes.',
      error: error.message,
    });
  }
}

async function getAlmacenById(req, res) {
  try {
    const { id } = req.params;

    const almacen = await Almacen.findByPk(id);

    if (!almacen) {
      return res.status(404).json({
        ok: false,
        message: 'Almacén no encontrado.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: almacen,
    });
  } catch (error) {
    console.error('ERROR GET ALMACEN BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener almacén.',
      error: error.message,
    });
  }
}

async function updateAlmacen(req, res) {
  try {
    const { id } = req.params;
    const { nombre, ubicacion, descripcion } = req.body;

    const almacen = await Almacen.findByPk(id);

    if (!almacen) {
      return res.status(404).json({
        ok: false,
        message: 'Almacén no encontrado.',
      });
    }

    const existe = await Almacen.findOne({ where: { nombre } });

    if (existe && existe.id_almacen !== almacen.id_almacen) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un almacén con ese nombre.',
      });
    }

    await almacen.update({
      nombre,
      ubicacion: ubicacion || null,
      descripcion: descripcion || null,
    });

    return res.status(200).json({
      ok: true,
      message: 'Almacén actualizado correctamente.',
      data: almacen,
    });
  } catch (error) {
    console.error('ERROR UPDATE ALMACEN:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar almacén.',
      error: error.message,
    });
  }
}

async function changeAlmacenStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const almacen = await Almacen.findByPk(id);

    if (!almacen) {
      return res.status(404).json({
        ok: false,
        message: 'Almacén no encontrado.',
      });
    }

    await almacen.update({ estado });

    return res.status(200).json({
      ok: true,
      message: 'Estado del almacén actualizado correctamente.',
      data: almacen,
    });
  } catch (error) {
    console.error('ERROR CHANGE ALMACEN STATUS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar estado del almacén.',
      error: error.message,
    });
  }
}

module.exports = {
  createAlmacen,
  getAlmacenes,
  getAlmacenById,
  updateAlmacen,
  changeAlmacenStatus,
};