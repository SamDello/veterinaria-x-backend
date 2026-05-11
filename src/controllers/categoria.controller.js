const { Categoria } = require('../models');

async function createCategoria(req, res) {
  try {
    const { nombre, descripcion } = req.body;

    const existe = await Categoria.findOne({ where: { nombre } });
    if (existe) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe una categoría con ese nombre.',
      });
    }

    const categoria = await Categoria.create({
      nombre,
      descripcion: descripcion || null,
      estado: true,
    });

    return res.status(201).json({
      ok: true,
      message: 'Categoría registrada correctamente.',
      data: categoria,
    });
  } catch (error) {
    console.error('ERROR CREATE CATEGORIA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar categoría.',
      error: error.message,
    });
  }
}

async function getCategorias(req, res) {
  try {
    const categorias = await Categoria.findAll({
      order: [['id_categoria', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: categorias,
    });
  } catch (error) {
    console.error('ERROR GET CATEGORIAS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar categorías.',
      error: error.message,
    });
  }
}

async function getCategoriaById(req, res) {
  try {
    const { id } = req.params;

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({
        ok: false,
        message: 'Categoría no encontrada.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: categoria,
    });
  } catch (error) {
    console.error('ERROR GET CATEGORIA BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener categoría.',
      error: error.message,
    });
  }
}

async function updateCategoria(req, res) {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({
        ok: false,
        message: 'Categoría no encontrada.',
      });
    }

    const existe = await Categoria.findOne({ where: { nombre } });

    if (existe && existe.id_categoria !== categoria.id_categoria) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe una categoría con ese nombre.',
      });
    }

    await categoria.update({
      nombre,
      descripcion: descripcion || null,
    });

    return res.status(200).json({
      ok: true,
      message: 'Categoría actualizada correctamente.',
      data: categoria,
    });
  } catch (error) {
    console.error('ERROR UPDATE CATEGORIA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar categoría.',
      error: error.message,
    });
  }
}

async function changeCategoriaStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const categoria = await Categoria.findByPk(id);

    if (!categoria) {
      return res.status(404).json({
        ok: false,
        message: 'Categoría no encontrada.',
      });
    }

    await categoria.update({ estado });

    return res.status(200).json({
      ok: true,
      message: 'Estado de la categoría actualizado correctamente.',
      data: categoria,
    });
  } catch (error) {
    console.error('ERROR CHANGE CATEGORIA STATUS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar estado de la categoría.',
      error: error.message,
    });
  }
}

module.exports = {
  createCategoria,
  getCategorias,
  getCategoriaById,
  updateCategoria,
  changeCategoriaStatus,
};