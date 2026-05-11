const { Op } = require('sequelize');
const {
  Usuario,
  Rol,
  Permiso,
  Empleado,
} = require('../models');
const { hashPassword, comparePassword, isStrongPassword } = require('../utils/password');
const { generateToken } = require('../utils/jwt');

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_MINUTES = 15;

async function register(req, res) {
  try {
    const { username, correo, password, rol, empleado } = req.body;

    if (!isStrongPassword(password)) {
      return res.status(400).json({
        ok: false,
        message:
          'La contraseña debe tener al menos 8 caracteres, una mayuscula, una minuscula, un numero y un caracter especial.',
      });
    }

    const existingUser = await Usuario.findOne({
      where: {
        [Op.or]: [{ username }, { correo }],
      },
    });

    if (existingUser) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un usuario con ese username o correo.',
      });
    }

    const rolEncontrado = await Rol.findOne({
      where: { nombre: rol.toUpperCase() },
    });

    if (!rolEncontrado) {
      return res.status(404).json({
        ok: false,
        message: 'El rol especificado no existe.',
      });
    }

    const password_hash = await hashPassword(password);

    const usuario = await Usuario.create({
      username,
      correo,
      password_hash,
      estado: true,
    });

    await usuario.addRole(rolEncontrado);

    let empleadoCreado = null;

    if (empleado) {
      empleadoCreado = await Empleado.create({
        id_usuario: usuario.id_usuario,
        nombre: empleado.nombre,
        apellidos: empleado.apellidos,
        ci: empleado.ci || null,
        telefono: empleado.telefono || null,
        direccion: empleado.direccion || null,
        cargo: empleado.cargo || null,
        especialidad: empleado.especialidad || null,
        estado: true,
      });
    }

    return res.status(201).json({
      ok: true,
      message: 'Usuario registrado correctamente.',
      data: {
        usuario: {
          id_usuario: usuario.id_usuario,
          username: usuario.username,
          correo: usuario.correo,
        },
        rol: rolEncontrado.nombre,
        empleado: empleadoCreado,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar usuario.',
      error: error.message,
    });
  }
}

async function login(req, res) {
  try {
    const { correo, password } = req.body;

    const usuario = await Usuario.findOne({
      where: { correo },
      include: [
        {
          model: Rol,
          as: 'roles',
          include: [
            {
              model: Permiso,
              as: 'permisos',
              through: { attributes: [] },
            },
          ],
          through: { attributes: [] },
        },
        {
          model: Empleado,
          as: 'empleado',
        },
      ],
    });

    if (!usuario) {
      return res.status(401).json({
        ok: false,
        message: 'Credenciales incorrectas.',
      });
    }

    if (!usuario.estado) {
      return res.status(403).json({
        ok: false,
        message: 'Usuario inactivo.',
      });
    }

    if (usuario.bloqueado_hasta && new Date(usuario.bloqueado_hasta) > new Date()) {
      return res.status(423).json({
        ok: false,
        message: 'Usuario bloqueado temporalmente por multiples intentos fallidos.',
        bloqueado_hasta: usuario.bloqueado_hasta,
      });
    }

    const validPassword = await comparePassword(password, usuario.password_hash);

    if (!validPassword) {
      const nuevosIntentos = usuario.intentos_fallidos + 1;
      const updateData = { intentos_fallidos: nuevosIntentos };

      if (nuevosIntentos >= MAX_LOGIN_ATTEMPTS) {
        const lockDate = new Date();
        lockDate.setMinutes(lockDate.getMinutes() + LOCK_MINUTES);
        updateData.bloqueado_hasta = lockDate;
      }

      await usuario.update(updateData);

      return res.status(401).json({
        ok: false,
        message: 'Credenciales incorrectas.',
      });
    }

    await usuario.update({
      intentos_fallidos: 0,
      bloqueado_hasta: null,
      ultimo_acceso: new Date(),
    });

    const roles = usuario.roles.map((r) => r.nombre);
    const permisos = [
      ...new Set(
        usuario.roles.flatMap((r) => r.permisos.map((p) => p.nombre))
      ),
    ];

    const token = generateToken({
      id_usuario: usuario.id_usuario,
      username: usuario.username,
      correo: usuario.correo,
      roles,
      permisos,
    });

    return res.status(200).json({
      ok: true,
      message: 'Inicio de sesion exitoso.',
      token,
      user: {
        id_usuario: usuario.id_usuario,
        username: usuario.username,
        correo: usuario.correo,
        roles,
        permisos,
        empleado: usuario.empleado,
      },
    });
  } catch (error) {
    return res.status(500).json({
      ok: false,
      message: 'Error al iniciar sesion.',
      error: error.message,
    });
  }
}

async function profile(req, res) {
  try {
    const usuario = await Usuario.findByPk(req.user.id_usuario, {
      attributes: { exclude: ['password_hash'] },
      include: [
        {
          model: Rol,
          as: 'roles',
          include: [
            {
              model: Permiso,
              as: 'permisos',
              through: { attributes: [] },
            },
          ],
          through: { attributes: [] },
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
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener perfil.',
      error: error.message,
    });
  }
}

module.exports = {
  register,
  login,
  profile,
};