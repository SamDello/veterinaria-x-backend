const { Proveedor } = require('../models');

async function createProveedor(req, res) {
  try {
    const { nombre, nit, telefono, correo, direccion } = req.body;

    const proveedor = await Proveedor.create({
      nombre,
      nit: nit || null,
      telefono: telefono || null,
      correo: correo || null,
      direccion: direccion || null,
      estado: true,
    });

    return res.status(201).json({
      ok: true,
      message: 'Proveedor registrado correctamente.',
      data: proveedor,
    });
  } catch (error) {
    console.error('ERROR CREATE PROVEEDOR:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar proveedor.',
      error: error.message,
    });
  }
}

async function getProveedores(req, res) {
  try {
    const proveedores = await Proveedor.findAll({
      order: [['id_proveedor', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: proveedores,
    });
  } catch (error) {
    console.error('ERROR GET PROVEEDORES:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar proveedores.',
      error: error.message,
    });
  }
}

async function getProveedorById(req, res) {
  try {
    const { id } = req.params;

    const proveedor = await Proveedor.findByPk(id);

    if (!proveedor) {
      return res.status(404).json({
        ok: false,
        message: 'Proveedor no encontrado.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: proveedor,
    });
  } catch (error) {
    console.error('ERROR GET PROVEEDOR BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener proveedor.',
      error: error.message,
    });
  }
}

async function updateProveedor(req, res) {
  try {
    const { id } = req.params;
    const { nombre, nit, telefono, correo, direccion, estado } = req.body;

    const proveedor = await Proveedor.findByPk(id);

    if (!proveedor) {
      return res.status(404).json({
        ok: false,
        message: 'Proveedor no encontrado.',
      });
    }

    await proveedor.update({
      nombre: nombre ?? proveedor.nombre,
      nit: nit ?? proveedor.nit,
      telefono: telefono ?? proveedor.telefono,
      correo: correo ?? proveedor.correo,
      direccion: direccion ?? proveedor.direccion,
      estado: estado ?? proveedor.estado,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: 'Proveedor actualizado correctamente.',
      data: proveedor,
    });
  } catch (error) {
    console.error('ERROR UPDATE PROVEEDOR:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar proveedor.',
      error: error.message,
    });
  }
}

async function deleteProveedor(req, res) {
  try {
    const { id } = req.params;

    const proveedor = await Proveedor.findByPk(id);

    if (!proveedor) {
      return res.status(404).json({
        ok: false,
        message: 'Proveedor no encontrado.',
      });
    }

    await proveedor.update({
      estado: false,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: 'Proveedor desactivado correctamente.',
    });
  } catch (error) {
    console.error('ERROR DELETE PROVEEDOR:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al desactivar proveedor.',
      error: error.message,
    });
  }
}

async function changeProveedorStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const proveedor = await Proveedor.findByPk(id);

    if (!proveedor) {
      return res.status(404).json({
        ok: false,
        message: 'Proveedor no encontrado.',
      });
    }

    await proveedor.update({
      estado,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: estado ? 'Proveedor activado correctamente.' : 'Proveedor desactivado correctamente.',
      data: proveedor,
    });
  } catch (error) {
    console.error('ERROR CHANGE PROVEEDOR STATUS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar estado del proveedor.',
      error: error.message,
    });
  }
}

module.exports = {
  createProveedor,
  getProveedores,
  getProveedorById,
  updateProveedor,
  deleteProveedor,
  changeProveedorStatus,
};