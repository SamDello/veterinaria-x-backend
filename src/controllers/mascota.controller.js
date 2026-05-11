const { Mascota, Cliente, Raza, Especie } = require('../models');
const { uploadImageBuffer, deleteImage } = require('../services/cloudinary.service');

async function createMascota(req, res) {
  try {
      
      //--------
    const {
      id_cliente,
      id_raza,
      nombre,
      color,
      sexo,
      fecha_nacimiento,
      peso,
      observaciones,
    } = req.body;

    const cliente = await Cliente.findByPk(id_cliente);
    if (!cliente) {
      return res.status(404).json({
        ok: false,
        message: 'Cliente no encontrado.',
      });
    }

    const raza = await Raza.findByPk(id_raza);
    if (!raza) {
      return res.status(404).json({
        ok: false,
        message: 'Raza no encontrada.',
      });
    }

    let imagenUrl = null;
      let imagenPublicId = null;

      if (req.file) {
        const uploadResult = await uploadImageBuffer(req.file.buffer);
        imagenUrl = uploadResult.secure_url;
        imagenPublicId = uploadResult.public_id;
      }
      //------

    const mascota = await Mascota.create({
      id_cliente,
      id_raza,
      nombre,
      color: color || null,
      sexo: sexo || null,
      fecha_nacimiento: fecha_nacimiento || null,
      peso: peso || null,
      observaciones: observaciones || null,
      estado: true,
      imagen_url: imagenUrl,
      imagen_public_id: imagenPublicId,
    });

    return res.status(201).json({
      ok: true,
      message: 'Mascota registrada correctamente.',
      data: mascota,
    });
  } catch (error) {
    console.error('ERROR CREATE MASCOTA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar mascota.',
      error: error.message,
    });
  }
}

async function getMascotas(req, res) {
  try {
    const mascotas = await Mascota.findAll({
      include: [
        {
          model: Cliente,
          as: 'cliente',
        },
        {
          model: Raza,
          as: 'raza',
          include: [
            {
              model: Especie,
              as: 'especie',
            },
          ],
        },
      ],
      order: [['id_mascota', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: mascotas,
    });
  } catch (error) {
    console.error('ERROR GET MASCOTAS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar mascotas.',
      error: error.message,
    });
  }
}

async function getMascotaById(req, res) {
  try {
    const { id } = req.params;

    const mascota = await Mascota.findByPk(id, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
        },
        {
          model: Raza,
          as: 'raza',
          include: [
            {
              model: Especie,
              as: 'especie',
            },
          ],
        },
      ],
    });

    if (!mascota) {
      return res.status(404).json({
        ok: false,
        message: 'Mascota no encontrada.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: mascota,
    });
  } catch (error) {
    console.error('ERROR GET MASCOTA BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener mascota.',
      error: error.message,
    });
  }
}

async function updateMascota(req, res) {
  try {
    
    const { id } = req.params;
    const {
      id_cliente,
      id_raza,
      nombre,
      color,
      sexo,
      fecha_nacimiento,
      peso,
      observaciones,
      estado,
    } = req.body;

    const mascota = await Mascota.findByPk(id);

    if (!mascota) {
      return res.status(404).json({
        ok: false,
        message: 'Mascota no encontrada.',
      });
    }

    if (id_cliente) {
      const cliente = await Cliente.findByPk(id_cliente);
      if (!cliente) {
        return res.status(404).json({
          ok: false,
          message: 'Cliente no encontrado.',
        });
      }
    }

    if (id_raza) {
      const raza = await Raza.findByPk(id_raza);
      if (!raza) {
        return res.status(404).json({
          ok: false,
          message: 'Raza no encontrada.',
        });
      }
    }
    let imagenUrl = mascota.imagen_url;
    let imagenPublicId = mascota.imagen_public_id;

    if (req.file) {
      if (mascota.imagen_public_id) {
        await deleteImage(mascota.imagen_public_id);
      }

      const uploadResult = await uploadImageBuffer(req.file.buffer);
      imagenUrl = uploadResult.secure_url;
      imagenPublicId = uploadResult.public_id;
    }

    await mascota.update({
      id_cliente: id_cliente ?? mascota.id_cliente,
      id_raza: id_raza ?? mascota.id_raza,
      nombre: nombre ?? mascota.nombre,
      color: color ?? mascota.color,
      sexo: sexo ?? mascota.sexo,
      fecha_nacimiento: fecha_nacimiento ?? mascota.fecha_nacimiento,
      peso: peso ?? mascota.peso,
      observaciones: observaciones ?? mascota.observaciones,
      estado: estado ?? mascota.estado,
      updated_at: new Date(),
      imagen_url: imagenUrl,
  imagen_public_id: imagenPublicId,
    });

    return res.status(200).json({
      ok: true,
      message: 'Mascota actualizada correctamente.',
      data: mascota,
    });
  } catch (error) {
    console.error('ERROR UPDATE MASCOTA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar mascota.',
      error: error.message,
    });
  }
}

async function deleteMascota(req, res) {
  try {
    const { id } = req.params;

    const mascota = await Mascota.findByPk(id);

    if (!mascota) {
      return res.status(404).json({
        ok: false,
        message: 'Mascota no encontrada.',
      });
    }

    await mascota.update({
      estado: false,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: 'Mascota desactivada correctamente.',
    });
  } catch (error) {
    console.error('ERROR DELETE MASCOTA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al desactivar mascota.',
      error: error.message,
    });
  }
}

async function changeMascotaStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const mascota = await Mascota.findByPk(id);

    if (!mascota) {
      return res.status(404).json({
        ok: false,
        message: 'Mascota no encontrada.',
      });
    }

    await mascota.update({
      estado,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: estado ? 'Mascota activada correctamente.' : 'Mascota desactivada correctamente.',
      data: mascota,
    });
  } catch (error) {
    console.error('ERROR CHANGE MASCOTA STATUS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar estado de la mascota.',
      error: error.message,
    });
  }
}

module.exports = {
  createMascota,
  getMascotas,
  getMascotaById,
  updateMascota,
  deleteMascota,
  changeMascotaStatus,
};