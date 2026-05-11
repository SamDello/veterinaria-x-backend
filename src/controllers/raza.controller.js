const { Raza, Especie } = require('../models');

async function createRaza(req, res) {
  try {
    const { id_especie, nombre, descripcion } = req.body;

    const especie = await Especie.findByPk(id_especie);
    if (!especie) {
      return res.status(404).json({
        ok: false,
        message: 'Especie no encontrada.',
      });
    }

    const existe = await Raza.findOne({
      where: { id_especie, nombre },
    });

    if (existe) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe una raza con ese nombre para la especie seleccionada.',
      });
    }

    const raza = await Raza.create({
      id_especie,
      nombre,
      descripcion: descripcion || null,
      estado: true,
    });

    return res.status(201).json({
      ok: true,
      message: 'Raza registrada correctamente.',
      data: raza,
    });
  } catch (error) {
    console.error('ERROR CREATE RAZA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar raza.',
      error: error.message,
    });
  }
}

async function getRazas(req, res) {
  try {
    const razas = await Raza.findAll({
      include: [
        {
          model: Especie,
          as: 'especie',
        },
      ],
      order: [['id_raza', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: razas,
    });
  } catch (error) {
    console.error('ERROR GET RAZAS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar razas.',
      error: error.message,
    });
  }
}

async function getRazaById(req, res) {
  try {
    const { id } = req.params;

    const raza = await Raza.findByPk(id, {
      include: [
        {
          model: Especie,
          as: 'especie',
        },
      ],
    });

    if (!raza) {
      return res.status(404).json({
        ok: false,
        message: 'Raza no encontrada.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: raza,
    });
  } catch (error) {
    console.error('ERROR GET RAZA BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener raza.',
      error: error.message,
    });
  }
}

async function updateRaza(req, res) {
  try {
    const { id } = req.params;
    const { id_especie, nombre, descripcion } = req.body;

    const raza = await Raza.findByPk(id);

    if (!raza) {
      return res.status(404).json({
        ok: false,
        message: 'Raza no encontrada.',
      });
    }

    const nuevaEspecieId = id_especie ?? raza.id_especie;
    const nuevoNombre = nombre ?? raza.nombre;

    const especie = await Especie.findByPk(nuevaEspecieId);
    if (!especie) {
      return res.status(404).json({
        ok: false,
        message: 'Especie no encontrada.',
      });
    }

    const existe = await Raza.findOne({
      where: {
        id_especie: nuevaEspecieId,
        nombre: nuevoNombre,
      },
    });

    if (existe && existe.id_raza !== raza.id_raza) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe una raza con ese nombre para la especie seleccionada.',
      });
    }

    await raza.update({
      id_especie: nuevaEspecieId,
      nombre: nuevoNombre,
      descripcion: descripcion ?? raza.descripcion,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: 'Raza actualizada correctamente.',
      data: raza,
    });
  } catch (error) {
    console.error('ERROR UPDATE RAZA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar raza.',
      error: error.message,
    });
  }
}

async function deleteRaza(req, res) {
  try {
    const { id } = req.params;

    const raza = await Raza.findByPk(id);

    if (!raza) {
      return res.status(404).json({
        ok: false,
        message: 'Raza no encontrada.',
      });
    }

    await raza.update({
      estado: false,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: 'Raza desactivada correctamente.',
    });
  } catch (error) {
    console.error('ERROR DELETE RAZA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al desactivar raza.',
      error: error.message,
    });
  }
}

async function changeRazaStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const raza = await Raza.findByPk(id);

    if (!raza) {
      return res.status(404).json({
        ok: false,
        message: 'Raza no encontrada.',
      });
    }

    await raza.update({
      estado,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: estado
        ? 'Raza activada correctamente.'
        : 'Raza desactivada correctamente.',
      data: raza,
    });
  } catch (error) {
    console.error('ERROR CHANGE RAZA STATUS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar estado de la raza.',
      error: error.message,
    });
  }
}

module.exports = {
  createRaza,
  getRazas,
  getRazaById,
  updateRaza,
  deleteRaza,
  changeRazaStatus,
};