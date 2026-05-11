const {
  AtencionVeterinaria,
  AtencionServicio,
  Mascota,
  Empleado,
  ServicioVeterinario,
  sequelize,
} = require('../models');

async function createAtencionVeterinaria(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const {
      id_mascota,
      id_empleado,
      fecha,
      motivo_consulta,
      diagnostico,
      tratamiento,
      observaciones,
      peso,
      temperatura,
      servicios,
    } = req.body;

    const mascota = await Mascota.findByPk(id_mascota, { transaction });
    if (!mascota) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        message: 'Mascota no encontrada.',
      });
    }

    const empleado = await Empleado.findByPk(id_empleado, { transaction });
    if (!empleado) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        message: 'Empleado no encontrado.',
      });
    }

    const atencion = await AtencionVeterinaria.create(
      {
        id_mascota,
        id_empleado,
        fecha: fecha || new Date(),
        motivo_consulta: motivo_consulta || null,
        diagnostico: diagnostico || null,
        tratamiento: tratamiento || null,
        observaciones: observaciones || null,
        peso: peso || null,
        temperatura: temperatura || null,
        estado: true,
      },
      { transaction }
    );

    if (Array.isArray(servicios) && servicios.length > 0) {
      for (const item of servicios) {
        if (!item.id_servicio) {
          continue;
        }

        const servicio = await ServicioVeterinario.findByPk(item.id_servicio, { transaction });

        if (!servicio) {
          continue;
        }

        const cantidad = Number(item.cantidad || 1);
        const precio_unitario = Number(item.precio_unitario || servicio.precio);
        const subtotal = cantidad * precio_unitario;

        await AtencionServicio.create(
          {
            id_atencion: atencion.id_atencion,
            id_servicio: servicio.id_servicio,
            cantidad,
            precio_unitario,
            subtotal,
            observacion: item.observacion || null,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    const atencionCreada = await AtencionVeterinaria.findByPk(atencion.id_atencion, {
      include: [
        {
          model: Mascota,
          as: 'mascota',
        },
        {
          model: Empleado,
          as: 'empleado',
        },
        {
          model: ServicioVeterinario,
          as: 'servicios',
          through: {
            attributes: ['cantidad', 'precio_unitario', 'subtotal', 'observacion'],
          },
        },
      ],
    });

    return res.status(201).json({
      ok: true,
      message: 'Atención veterinaria registrada correctamente.',
      data: atencionCreada,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('ERROR CREATE ATENCION VETERINARIA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar atención veterinaria.',
      error: error.message,
    });
  }
}

async function getAtencionesVeterinarias(req, res) {
  try {
    const atenciones = await AtencionVeterinaria.findAll({
      include: [
        {
          model: Mascota,
          as: 'mascota',
        },
        {
          model: Empleado,
          as: 'empleado',
        },
        {
          model: ServicioVeterinario,
          as: 'servicios',
          through: {
            attributes: ['cantidad', 'precio_unitario', 'subtotal', 'observacion'],
          },
        },
      ],
      order: [['id_atencion', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: atenciones,
    });
  } catch (error) {
    console.error('ERROR GET ATENCIONES VETERINARIAS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar atenciones veterinarias.',
      error: error.message,
    });
  }
}

async function getAtencionVeterinariaById(req, res) {
  try {
    const { id } = req.params;

    const atencion = await AtencionVeterinaria.findByPk(id, {
      include: [
        {
          model: Mascota,
          as: 'mascota',
        },
        {
          model: Empleado,
          as: 'empleado',
        },
        {
          model: ServicioVeterinario,
          as: 'servicios',
          through: {
            attributes: ['cantidad', 'precio_unitario', 'subtotal', 'observacion'],
          },
        },
      ],
    });

    if (!atencion) {
      return res.status(404).json({
        ok: false,
        message: 'Atención veterinaria no encontrada.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: atencion,
    });
  } catch (error) {
    console.error('ERROR GET ATENCION VETERINARIA BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener atención veterinaria.',
      error: error.message,
    });
  }
}

async function updateAtencionVeterinaria(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const { id } = req.params;
    const {
      id_mascota,
      id_empleado,
      fecha,
      motivo_consulta,
      diagnostico,
      tratamiento,
      observaciones,
      peso,
      temperatura,
      servicios,
    } = req.body;

    const atencion = await AtencionVeterinaria.findByPk(id, { transaction });

    if (!atencion) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        message: 'Atención veterinaria no encontrada.',
      });
    }

    const mascota = await Mascota.findByPk(id_mascota, { transaction });
    if (!mascota) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        message: 'Mascota no encontrada.',
      });
    }

    const empleado = await Empleado.findByPk(id_empleado, { transaction });
    if (!empleado) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        message: 'Empleado no encontrado.',
      });
    }

    await atencion.update(
      {
        id_mascota,
        id_empleado,
        fecha: fecha || atencion.fecha,
        motivo_consulta: motivo_consulta || null,
        diagnostico: diagnostico || null,
        tratamiento: tratamiento || null,
        observaciones: observaciones || null,
        peso: peso || null,
        temperatura: temperatura || null,
        updated_at: new Date(),
      },
      { transaction }
    );

    await AtencionServicio.destroy({
      where: { id_atencion: atencion.id_atencion },
      transaction,
    });

    if (Array.isArray(servicios) && servicios.length > 0) {
      for (const item of servicios) {
        if (!item.id_servicio) {
          continue;
        }

        const servicio = await ServicioVeterinario.findByPk(item.id_servicio, { transaction });

        if (!servicio) {
          continue;
        }

        const cantidad = Number(item.cantidad || 1);
        const precio_unitario = Number(item.precio_unitario || servicio.precio);
        const subtotal = cantidad * precio_unitario;

        await AtencionServicio.create(
          {
            id_atencion: atencion.id_atencion,
            id_servicio: servicio.id_servicio,
            cantidad,
            precio_unitario,
            subtotal,
            observacion: item.observacion || null,
          },
          { transaction }
        );
      }
    }

    await transaction.commit();

    const atencionActualizada = await AtencionVeterinaria.findByPk(atencion.id_atencion, {
      include: [
        {
          model: Mascota,
          as: 'mascota',
        },
        {
          model: Empleado,
          as: 'empleado',
        },
        {
          model: ServicioVeterinario,
          as: 'servicios',
          through: {
            attributes: ['cantidad', 'precio_unitario', 'subtotal', 'observacion'],
          },
        },
      ],
    });

    return res.status(200).json({
      ok: true,
      message: 'Atención veterinaria actualizada correctamente.',
      data: atencionActualizada,
    });
  } catch (error) {
    await transaction.rollback();
    console.error('ERROR UPDATE ATENCION VETERINARIA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar atención veterinaria.',
      error: error.message,
    });
  }
}

async function changeAtencionVeterinariaStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const atencion = await AtencionVeterinaria.findByPk(id);

    if (!atencion) {
      return res.status(404).json({
        ok: false,
        message: 'Atención veterinaria no encontrada.',
      });
    }

    await atencion.update({
      estado,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: estado
        ? 'Atención veterinaria activada correctamente.'
        : 'Atención veterinaria desactivada correctamente.',
      data: atencion,
    });
  } catch (error) {
    console.error('ERROR CHANGE ATENCION VETERINARIA STATUS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar estado de la atención veterinaria.',
      error: error.message,
    });
  }
}

module.exports = {
  createAtencionVeterinaria,
  getAtencionesVeterinarias,
  getAtencionVeterinariaById,
  updateAtencionVeterinaria,
  changeAtencionVeterinariaStatus,
};