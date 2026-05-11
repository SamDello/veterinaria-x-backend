const { Op } = require('sequelize');
const { Usuario, Rol, Empleado, Permiso } = require('../models');
const { hashPassword, isStrongPassword } = require('../utils/password');

async function getUsuarios(req, res) {
  try {
    const usuarios = await Usuario.findAll({
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Rol,
          as: 'roles',
          through: { attributes: [] },
          include: [
            {
              model: Permiso,
              as: 'permisos',
              through: { attributes: [] },
            },
          ],
        },
        {
          model: Empleado,
          as: 'empleado',
        },
      ],
      order: [['id_usuario', 'ASC']],
    });

    return res.status(200).json({
      ok: true,
      data: usuarios,
    });
  } catch (error) {
    console.error('ERROR GET USUARIOS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar usuarios.',
      error: error.message,
    });
  }
}

async function getUsuarioById(req, res) {
  try {
    const { id } = req.params;

    const usuario = await Usuario.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Rol,
          as: 'roles',
          through: { attributes: [] },
          include: [
            {
              model: Permiso,
              as: 'permisos',
              through: { attributes: [] },
            },
          ],
        },
        {
          model: Empleado,
          as: 'empleado',
        },
      ],
    });

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: usuario,
    });
  } catch (error) {
    console.error('ERROR GET USUARIO BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener usuario.',
      error: error.message,
    });
  }
}

async function createUsuario(req, res) {
  try {
    const { username, correo, password, roles } = req.body;

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        ok: false,
        message:
          'La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula, un numero y un caracter especial.',
      });
    }

    const existe = await Usuario.findOne({
      where: {
        [Op.or]: [{ username }, { correo }],
      },
    });

    if (existe) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un usuario con ese username o correo.',
      });
    }

    const rolesEncontrados = await Rol.findAll({
      where: {
        id_rol: roles,
      },
    });

    if (rolesEncontrados.length !== roles.length) {
      return res.status(400).json({
        ok: false,
        message: 'Uno o mas roles no existen.',
      });
    }

    const password_hash = await hashPassword(password);

    const usuario = await Usuario.create({
      username,
      correo,
      password_hash,
      estado: true,
      intentos_fallidos: 0,
      bloqueado_hasta: null,
    });

    await usuario.setRoles(rolesEncontrados);

    const usuarioCreado = await Usuario.findByPk(usuario.id_usuario, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Rol,
          as: 'roles',
          through: { attributes: [] },
        },
      ],
    });

    return res.status(201).json({
      ok: true,
      message: 'Usuario registrado correctamente.',
      data: usuarioCreado,
    });
  } catch (error) {
    console.error('ERROR CREATE USUARIO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar usuario.',
      error: error.message,
    });
  }
}

async function updateUsuario(req, res) {
  try {
    const { id } = req.params;
    const { username, correo, password } = req.body;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado.',
      });
    }

    if (username || correo) {
      const existe = await Usuario.findOne({
        where: {
          id_usuario: { [Op.ne]: id },
          [Op.or]: [
            ...(username ? [{ username }] : []),
            ...(correo ? [{ correo }] : []),
          ],
        },
      });

      if (existe) {
        return res.status(409).json({
          ok: false,
          message: 'Ya existe otro usuario con ese username o correo.',
        });
      }
    }

    const updateData = {
      username: username ?? usuario.username,
      correo: correo ?? usuario.correo,
      updated_at: new Date(),
    };

    if (password) {
      if (!isStrongPassword(password)) {
        return res.status(400).json({
          ok: false,
          message:
            'La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula, un numero y un caracter especial.',
        });
      }

      updateData.password_hash = await hashPassword(password);
    }

    await usuario.update(updateData);

    const usuarioActualizado = await Usuario.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Rol,
          as: 'roles',
          through: { attributes: [] },
        },
        {
          model: Empleado,
          as: 'empleado',
        },
      ],
    });

    return res.status(200).json({
      ok: true,
      message: 'Usuario actualizado correctamente.',
      data: usuarioActualizado,
    });
  } catch (error) {
    console.error('ERROR UPDATE USUARIO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar usuario.',
      error: error.message,
    });
  }
}

async function changeUsuarioStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado.',
      });
    }

    await usuario.update({
      estado,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: estado ? 'Usuario activado correctamente.' : 'Usuario desactivado correctamente.',
      data: usuario,
    });
  } catch (error) {
    console.error('ERROR CHANGE USUARIO STATUS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar estado del usuario.',
      error: error.message,
    });
  }
}

async function assignRolesToUsuario(req, res) {
  try {
    const { id } = req.params;
    const { roles } = req.body;

    const usuario = await Usuario.findByPk(id);

    if (!usuario) {
      return res.status(404).json({
        ok: false,
        message: 'Usuario no encontrado.',
      });
    }

    const rolesEncontrados = await Rol.findAll({
      where: {
        id_rol: roles,
      },
    });

    if (rolesEncontrados.length !== roles.length) {
      return res.status(400).json({
        ok: false,
        message: 'Uno o mas roles no existen.',
      });
    }

    await usuario.setRoles(rolesEncontrados);

    const usuarioActualizado = await Usuario.findByPk(id, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Rol,
          as: 'roles',
          through: { attributes: [] },
          include: [
            {
              model: Permiso,
              as: 'permisos',
              through: { attributes: [] },
            },
          ],
        },
        {
          model: Empleado,
          as: 'empleado',
        },
      ],
    });

    return res.status(200).json({
      ok: true,
      message: 'Roles asignados correctamente al usuario.',
      data: usuarioActualizado,
    });
  } catch (error) {
    console.error('ERROR ASSIGN ROLES TO USUARIO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al asignar roles al usuario.',
      error: error.message,
    });
  }
}

module.exports = {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  changeUsuarioStatus,
  assignRolesToUsuario,
};