const { Empleado, Usuario, Rol } = require('../models');

async function getEmpleados(req, res) {
  try {
    const empleados = await Empleado.findAll({
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: { exclude: ['password_hash'] },
          include: [
            {
              model: Rol,
              as: 'roles',
              through: { attributes: [] },
            },
          ],
        },
      ],
      order: [['id_empleado', 'ASC']],
    });

    return res.status(200).json({
      ok: true,
      data: empleados,
    });
  } catch (error) {
    console.error('ERROR GET EMPLEADOS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar empleados.',
      error: error.message,
    });
  }
}

async function getEmpleadoById(req, res) {
  try {
    const { id } = req.params;

    const empleado = await Empleado.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: { exclude: ['password_hash'] },
          include: [
            {
              model: Rol,
              as: 'roles',
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!empleado) {
      return res.status(404).json({
        ok: false,
        message: 'Empleado no encontrado.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: empleado,
    });
  } catch (error) {
    console.error('ERROR GET EMPLEADO BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener empleado.',
      error: error.message,
    });
  }
}

async function createEmpleado(req, res) {
  try {
    const {
      id_usuario,
      nombre,
      apellidos,
      ci,
      telefono,
      direccion,
      cargo,
      especialidad,
    } = req.body;

    const usuario = await Usuario.findByPk(id_usuario);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado.',
      });
    }

    const existeEmpleado = await Empleado.findOne({
      where: { id_usuario },
    });

    if (existeEmpleado) {
      return res.status(409).json({
        ok: false,
        message: 'Ese usuario ya tiene un empleado asociado.',
      });
    }

    const empleado = await Empleado.create({
      id_usuario,
      nombre,
      apellidos,
      ci: ci || null,
      telefono: telefono || null,
      direccion: direccion || null,
      cargo: cargo || null,
      especialidad: especialidad || null,
      estado: true,
    });

    const empleadoCreado = await Empleado.findByPk(empleado.id_empleado, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: { exclude: ['password_hash'] },
          include: [
            {
              model: Rol,
              as: 'roles',
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    return res.status(201).json({
      ok: true,
      message: 'Empleado registrado correctamente.',
      data: empleadoCreado,
    });
  } catch (error) {
    console.error('ERROR CREATE EMPLEADO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar empleado.',
      error: error.message,
    });
  }
}

async function updateEmpleado(req, res) {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellidos,
      ci,
      telefono,
      direccion,
      cargo,
      especialidad,
      estado,
    } = req.body;

    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      return res.status(404).json({
        ok: false,
        message: 'Empleado no encontrado.',
      });
    }

    await empleado.update({
      nombre: nombre ?? empleado.nombre,
      apellidos: apellidos ?? empleado.apellidos,
      ci: ci ?? empleado.ci,
      telefono: telefono ?? empleado.telefono,
      direccion: direccion ?? empleado.direccion,
      cargo: cargo ?? empleado.cargo,
      especialidad: especialidad ?? empleado.especialidad,
      estado: estado ?? empleado.estado,
      updated_at: new Date(),
    });

    const empleadoActualizado = await Empleado.findByPk(id, {
      include: [
        {
          model: Usuario,
          as: 'usuario',
          attributes: { exclude: ['password_hash'] },
          include: [
            {
              model: Rol,
              as: 'roles',
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    return res.status(200).json({
      ok: true,
      message: 'Empleado actualizado correctamente.',
      data: empleadoActualizado,
    });
  } catch (error) {
    console.error('ERROR UPDATE EMPLEADO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar empleado.',
      error: error.message,
    });
  }
}

async function changeEmpleadoStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const empleado = await Empleado.findByPk(id);

    if (!empleado) {
      return res.status(404).json({
        ok: false,
        message: 'Empleado no encontrado.',
      });
    }

    await empleado.update({
      estado,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: estado ? 'Empleado activado correctamente.' : 'Empleado desactivado correctamente.',
      data: empleado,
    });
  } catch (error) {
    console.error('ERROR CHANGE EMPLEADO STATUS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar estado del empleado.',
      error: error.message,
    });
  }
}

module.exports = {
  getEmpleados,
  getEmpleadoById,
  createEmpleado,
  updateEmpleado,
  changeEmpleadoStatus,
};