const { Permiso } = require('../models');

async function getPermisos(req, res) {
  try {
    const permisos = await Permiso.findAll({
      order: [['id_permiso', 'ASC']],
    });

    return res.status(200).json({
      ok: true,
      data: permisos,
    });
  } catch (error) {
    console.error('ERROR GET PERMISOS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar permisos.',
      error: error.message,
    });
  }
}

async function getPermisoById(req, res) {
  try {
    const { id } = req.params;

    const permiso = await Permiso.findByPk(id);

    if (!permiso) {
      return res.status(404).json({
        ok: false,
        message: 'Permiso no encontrado.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: permiso,
    });
  } catch (error) {
    console.error('ERROR GET PERMISO BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener permiso.',
      error: error.message,
    });
  }
}

module.exports = {
  getPermisos,
  getPermisoById,
};