const { Marca } = require('../models');

async function createMarca(req, res) {
  try {
    const { nombre, descripcion } = req.body;

    const existe = await Marca.findOne({ where: { nombre } });
    if (existe) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe una marca con ese nombre.',
      });
    }

    const marca = await Marca.create({
      nombre,
      descripcion: descripcion || null,
      estado: true,
    });

    return res.status(201).json({
      ok: true,
      message: 'Marca registrada correctamente.',
      data: marca,
    });
  } catch (error) {
    console.error('ERROR CREATE MARCA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar marca.',
      error: error.message,
    });
  }
}

async function getMarcas(req, res) {
  try {
    const marcas = await Marca.findAll({
      order: [['id_marca', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: marcas,
    });
  } catch (error) {
    console.error('ERROR GET MARCAS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar marcas.',
      error: error.message,
    });
  }
}

async function getMarcaById(req, res) {
  try {
    const { id } = req.params;

    const marca = await Marca.findByPk(id);

    if (!marca) {
      return res.status(404).json({
        ok: false,
        message: 'Marca no encontrada.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: marca,
    });
  } catch (error) {
    console.error('ERROR GET MARCA BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener marca.',
      error: error.message,
    });
  }
}

async function updateMarca(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const marca = await Marca.findByPk(id);

    if (!marca) {
      return res.status(404).json({
        ok: false,
        message: 'Marca no encontrada.',
      });
    }

    const existe = await Marca.findOne({ where: { nombre } });

    if (existe && existe.id_marca !== marca.id_marca) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe una marca con ese nombre.',
      });
    }

    await marca.update({
      nombre,
      descripcion: descripcion || null,
    });

    return res.status(200).json({
      ok: true,
      message: 'Marca actualizada correctamente.',
      data: marca,
    });
  } catch (error) {
    console.error('ERROR UPDATE MARCA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar marca.',
      error: error.message,
    });
  }
}

async function changeMarcaStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const marca = await Marca.findByPk(id);

    if (!marca) {
      return res.status(404).json({
        ok: false,
        message: 'Marca no encontrada.',
      });
    }

    await marca.update({ estado });

    return res.status(200).json({
      ok: true,
      message: 'Estado de la marca actualizado correctamente.',
      data: marca,
    });
  } catch (error) {
    console.error('ERROR CHANGE MARCA STATUS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar estado de la marca.',
      error: error.message,
    });
  }
}

module.exports = {
  createMarca,
  getMarcas,
  getMarcaById,
  updateMarca,
  changeMarcaStatus,
};