const { Cliente } = require('../models');

async function createCliente(req, res) {
  try {
    const { nombre, apellidos, ci_nit, telefono, correo, direccion } = req.body;

    const cliente = await Cliente.create({
      nombre,
      apellidos: apellidos || null,
      ci_nit: ci_nit || null,
      telefono: telefono || null,
      correo: correo || null,
      direccion: direccion || null,
      estado: true,
    });

    return res.status(201).json({
      ok: true,
      message: 'Cliente registrado correctamente.',
      data: cliente,
    });
  } catch (error) {
    console.error('ERROR CREATE CLIENTE:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar cliente.',
      error: error.message,
    });
  }
}

async function getClientes(req, res) {
  try {
    const clientes = await Cliente.findAll({
      order: [['id_cliente', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: clientes,
    });
  } catch (error) {
    console.error('ERROR GET CLIENTES:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar clientes.',
      error: error.message,
    });
  }
}

async function getClienteById(req, res) {
  try {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        message: 'Cliente no encontrado.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: cliente,
    });
  } catch (error) {
    console.error('ERROR GET CLIENTE BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener cliente.',
      error: error.message,
    });
  }
}

async function updateCliente(req, res) {
  try {
    const { id } = req.params;
    const { nombre, apellidos, ci_nit, telefono, correo, direccion, estado } = req.body;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        message: 'Cliente no encontrado.',
      });
    }

    await cliente.update({
      nombre: nombre ?? cliente.nombre,
      apellidos: apellidos ?? cliente.apellidos,
      ci_nit: ci_nit ?? cliente.ci_nit,
      telefono: telefono ?? cliente.telefono,
      correo: correo ?? cliente.correo,
      direccion: direccion ?? cliente.direccion,
      estado: estado ?? cliente.estado,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: 'Cliente actualizado correctamente.',
      data: cliente,
    });
  } catch (error) {
    console.error('ERROR UPDATE CLIENTE:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar cliente.',
      error: error.message,
    });
  }
}

async function deleteCliente(req, res) {
  try {
    const { id } = req.params;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        message: 'Cliente no encontrado.',
      });
    }

    await cliente.update({
      estado: false,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: 'Cliente desactivado correctamente.',
    });
  } catch (error) {
    console.error('ERROR DELETE CLIENTE:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al desactivar cliente.',
      error: error.message,
    });
  }
}

async function changeClienteStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        message: 'Cliente no encontrado.',
      });
    }

    await cliente.update({
      estado,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: estado ? 'Cliente activado correctamente.' : 'Cliente desactivado correctamente.',
      data: cliente,
    });
  } catch (error) {
    console.error('ERROR CHANGE CLIENTE STATUS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar estado del cliente.',
      error: error.message,
    });
  }
}

module.exports = {
  createCliente,
  getClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
  changeClienteStatus,
};