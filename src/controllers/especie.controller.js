const { Especie } = require('../models');

async function createEspecie(req, res) {
  try {
    const { nombre, descripcion } = req.body;

    const existe = await Especie.findOne({ where: { nombre } });
    if (existe) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe una especie con ese nombre.',
      });
    }

    const especie = await Especie.create({
      nombre,
      descripcion: descripcion || null,
      estado: true,
    });

    return res.status(201).json({
      ok: true,
      message: 'Especie registrada correctamente.',
      data: especie,
    });
  } catch (error) {
    console.error('ERROR CREATE ESPECIE:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar especie.',
      error: error.message,
    });
  }
}

async function getEspecies(req, res) {
  try {
    const especies = await Especie.findAll({
      order: [['id_especie', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: especies,
    });
  } catch (error) {
    console.error('ERROR GET ESPECIES:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar especies.',
      error: error.message,
    });
  }
}

async function getEspecieById(req, res) {
  try {
    const { id } = req.params;

    const especie = await Especie.findByPk(id);

    if (!especie) {
      return res.status(404).json({
        ok: false,
        message: 'Especie no encontrada.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: especie,
    });
  } catch (error) {
    console.error('ERROR GET ESPECIE BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener especie.',
      error: error.message,
    });
  }
}

async function updateEspecie(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const especie = await Especie.findByPk(id);

    if (!especie) {
      return res.status(404).json({
        ok: false,
        message: 'Especie no encontrada.',
      });
    }

    if (nombre) {
      const existe = await Especie.findOne({ where: { nombre } });

      if (existe && existe.id_especie !== especie.id_especie) {
        return res.status(409).json({
          ok: false,
          message: 'Ya existe una especie con ese nombre.',
        });
      }
    }

    await especie.update({
      nombre: nombre ?? especie.nombre,
      descripcion: descripcion ?? especie.descripcion,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: 'Especie actualizada correctamente.',
      data: especie,
    });
  } catch (error) {
    console.error('ERROR UPDATE ESPECIE:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar especie.',
      error: error.message,
    });
  }
}

async function deleteEspecie(req, res) {
  try {
    const { id } = req.params;

    const especie = await Especie.findByPk(id);

    if (!especie) {
      return res.status(404).json({
        ok: false,
        message: 'Especie no encontrada.',
      });
    }

    await especie.update({
      estado: false,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: 'Especie desactivada correctamente.',
    });
  } catch (error) {
    console.error('ERROR DELETE ESPECIE:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al desactivar especie.',
      error: error.message,
    });
  }
}

async function changeEspecieStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const especie = await Especie.findByPk(id);

    if (!especie) {
      return res.status(404).json({
        ok: false,
        message: 'Especie no encontrada.',
      });
    }

    await especie.update({
      estado,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: estado
        ? 'Especie activada correctamente.'
        : 'Especie desactivada correctamente.',
      data: especie,
    });
  } catch (error) {
    console.error('ERROR CHANGE ESPECIE STATUS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar estado de la especie.',
      error: error.message,
    });
  }
}

module.exports = {
  createEspecie,
  getEspecies,
  getEspecieById,
  updateEspecie,
  deleteEspecie,
  changeEspecieStatus,
};