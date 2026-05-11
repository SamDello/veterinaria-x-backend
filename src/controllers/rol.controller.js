const { Rol, Permiso } = require('../models');

async function getRoles(req, res) {
  try {
    const roles = await Rol.findAll({
      include: [
        {
          model: Permiso,
          as: 'permisos',
          through: { attributes: [] },
        },
      ],
      order: [['id_rol', 'ASC']],
    });

    return res.status(200).json({
      ok: true,
      data: roles,
    });
  } catch (error) {
    console.error('ERROR GET ROLES:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar roles.',
      error: error.message,
    });
  }
}

async function getRolById(req, res) {
  try {
    const { id } = req.params;

    const rol = await Rol.findByPk(id, {
      include: [
        {
          model: Permiso,
          as: 'permisos',
          through: { attributes: [] },
        },
      ],
    });

    if (!rol) {
      return res.status(404).json({
        ok: false,
        message: 'Rol no encontrado.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: rol,
    });
  } catch (error) {
    console.error('ERROR GET ROL BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener rol.',
      error: error.message,
    });
  }
}

async function createRol(req, res) {
  try {
    const { nombre, descripcion } = req.body;

    const existe = await Rol.findOne({
      where: { nombre: nombre.toUpperCase() },
    });

    if (existe) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un rol con ese nombre.',
      });
    }

    const rol = await Rol.create({
      nombre: nombre.toUpperCase(),
      descripcion: descripcion || null,
      estado: true,
    });

    return res.status(201).json({
      ok: true,
      message: 'Rol registrado correctamente.',
      data: rol,
    });
  } catch (error) {
    console.error('ERROR CREATE ROL:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar rol.',
      error: error.message,
    });
  }
}

async function updateRol(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion, estado } = req.body;

    const rol = await Rol.findByPk(id);

    if (!rol) {
      return res.status(404).json({
        ok: false,
        message: 'Rol no encontrado.',
      });
    }

    await rol.update({
      nombre: nombre ? nombre.toUpperCase() : rol.nombre,
      descripcion: descripcion ?? rol.descripcion,
      estado: estado ?? rol.estado,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: 'Rol actualizado correctamente.',
      data: rol,
    });
  } catch (error) {
    console.error('ERROR UPDATE ROL:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar rol.',
      error: error.message,
    });
  }
}

async function changeRolStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const rol = await Rol.findByPk(id);

    if (!rol) {
      return res.status(404).json({
        ok: false,
        message: 'Rol no encontrado.',
      });
    }

    await rol.update({
      estado,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: estado ? 'Rol activado correctamente.' : 'Rol desactivado correctamente.',
      data: rol,
    });
  } catch (error) {
    console.error('ERROR CHANGE ROL STATUS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar estado del rol.',
      error: error.message,
    });
  }
}

async function assignPermisosToRol(req, res) {
  try {
    const { id } = req.params;
    const { permisos } = req.body;

    const rol = await Rol.findByPk(id);

    if (!rol) {
      return res.status(404).json({
        ok: false,
        message: 'Rol no encontrado.',
      });
    }

    const permisosEncontrados = await Permiso.findAll({
      where: {
        id_permiso: permisos,
      },
    });

    if (permisosEncontrados.length !== permisos.length) {
      return res.status(400).json({
        ok: false,
        message: 'Uno o mas permisos no existen.',
      });
    }

    await rol.setPermisos(permisosEncontrados);

    const rolActualizado = await Rol.findByPk(id, {
      include: [
        {
          model: Permiso,
          as: 'permisos',
          through: { attributes: [] },
        },
      ],
    });

    return res.status(200).json({
      ok: true,
      message: 'Permisos asignados correctamente al rol.',
      data: rolActualizado,
    });
  } catch (error) {
    console.error('ERROR ASSIGN PERMISOS TO ROL:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al asignar permisos al rol.',
      error: error.message,
    });
  }
}

module.exports = {
  getRoles,
  getRolById,
  createRol,
  updateRol,
  changeRolStatus,
  assignPermisosToRol,
};