const { ServicioVeterinario } = require('../models');

async function createServicioVeterinario(req, res) {
  try {
    const { nombre, descripcion, precio } = req.body;

    const existe = await ServicioVeterinario.findOne({
      where: { nombre },
    });

    if (existe) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un servicio veterinario con ese nombre.',
      });
    }

    const servicio = await ServicioVeterinario.create({
      nombre,
      descripcion: descripcion || null,
      precio,
      estado: true,
    });

    return res.status(201).json({
      ok: true,
      message: 'Servicio veterinario registrado correctamente.',
      data: servicio,
    });
  } catch (error) {
    console.error('ERROR CREATE SERVICIO VETERINARIO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar servicio veterinario.',
      error: error.message,
    });
  }
}

async function getServiciosVeterinarios(req, res) {
  try {
    const servicios = await ServicioVeterinario.findAll({
      order: [['id_servicio', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: servicios,
    });
  } catch (error) {
    console.error('ERROR GET SERVICIOS VETERINARIOS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar servicios veterinarios.',
      error: error.message,
    });
  }
}

async function getServicioVeterinarioById(req, res) {
  try {
    const { id } = req.params;

    const servicio = await ServicioVeterinario.findByPk(id);

    if (!servicio) {
      return res.status(404).json({
        ok: false,
        message: 'Servicio veterinario no encontrado.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: servicio,
    });
  } catch (error) {
    console.error('ERROR GET SERVICIO VETERINARIO BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener servicio veterinario.',
      error: error.message,
    });
  }
}

async function updateServicioVeterinario(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion, precio } = req.body;

    const servicio = await ServicioVeterinario.findByPk(id);

    if (!servicio) {
      return res.status(404).json({
        ok: false,
        message: 'Servicio veterinario no encontrado.',
      });
    }

    if (nombre) {
      const existe = await ServicioVeterinario.findOne({
        where: { nombre },
      });

      if (existe && existe.id_servicio !== servicio.id_servicio) {
        return res.status(409).json({
          ok: false,
          message: 'Ya existe un servicio veterinario con ese nombre.',
        });
      }
    }

    await servicio.update({
      nombre: nombre ?? servicio.nombre,
      descripcion: descripcion ?? servicio.descripcion,
      precio: precio ?? servicio.precio,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: 'Servicio veterinario actualizado correctamente.',
      data: servicio,
    });
  } catch (error) {
    console.error('ERROR UPDATE SERVICIO VETERINARIO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar servicio veterinario.',
      error: error.message,
    });
  }
}

async function deleteServicioVeterinario(req, res) {
  try {
    const { id } = req.params;

    const servicio = await ServicioVeterinario.findByPk(id);

    if (!servicio) {
      return res.status(404).json({
        ok: false,
        message: 'Servicio veterinario no encontrado.',
      });
    }

    await servicio.update({
      estado: false,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: 'Servicio veterinario desactivado correctamente.',
    });
  } catch (error) {
    console.error('ERROR DELETE SERVICIO VETERINARIO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al desactivar servicio veterinario.',
      error: error.message,
    });
  }
}

async function changeServicioVeterinarioStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const servicio = await ServicioVeterinario.findByPk(id);

    if (!servicio) {
      return res.status(404).json({
        ok: false,
        message: 'Servicio veterinario no encontrado.',
      });
    }

    await servicio.update({
      estado,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: estado
        ? 'Servicio veterinario activado correctamente.'
        : 'Servicio veterinario desactivado correctamente.',
      data: servicio,
    });
  } catch (error) {
    console.error('ERROR CHANGE SERVICIO VETERINARIO STATUS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar estado del servicio veterinario.',
      error: error.message,
    });
  }
}

module.exports = {
  createServicioVeterinario,
  getServiciosVeterinarios,
  getServicioVeterinarioById,
  updateServicioVeterinario,
  deleteServicioVeterinario,
  changeServicioVeterinarioStatus,
};