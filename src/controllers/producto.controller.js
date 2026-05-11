const { Producto, Categoria, Marca } = require('../models');

async function createProducto(req, res) {
  try {
    const {
      id_categoria,
      id_marca,
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
    } = req.body;

    const categoria = await Categoria.findByPk(id_categoria);
    if (!categoria) {
      return res.status(404).json({
        ok: false,
        message: 'Categoria no encontrada.',
      });
    }

    const marca = await Marca.findByPk(id_marca);
    if (!marca) {
      return res.status(404).json({
        ok: false,
        message: 'Marca no encontrada.',
      });
    }

    const existe = await Producto.findOne({
      where: { nombre, id_marca },
    });

    if (existe) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un producto con ese nombre para la marca seleccionada.',
      });
    }

    const producto = await Producto.create({
      id_categoria,
      id_marca,
      nombre,
      descripcion: descripcion || null,
      precio_compra,
      precio_venta,
      estado: true,
    });

    return res.status(201).json({
      ok: true,
      message: 'Producto registrado correctamente.',
      data: producto,
    });
  } catch (error) {
    console.error('ERROR CREATE PRODUCTO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar producto.',
      error: error.message,
    });
  }
}

async function getProductos(req, res) {
  try {
    const productos = await Producto.findAll({
      include: [
        {
          model: Categoria,
          as: 'categoria',
        },
        {
          model: Marca,
          as: 'marca',
        },
      ],
      order: [['id_producto', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: productos,
    });
  } catch (error) {
    console.error('ERROR GET PRODUCTOS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar productos.',
      error: error.message,
    });
  }
}

async function getProductoById(req, res) {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id, {
      include: [
        {
          model: Categoria,
          as: 'categoria',
        },
        {
          model: Marca,
          as: 'marca',
        },
      ],
    });

    if (!producto) {
      return res.status(404).json({
        ok: false,
        message: 'Producto no encontrado.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: producto,
    });
  } catch (error) {
    console.error('ERROR GET PRODUCTO BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener producto.',
      error: error.message,
    });
  }
}

async function updateProducto(req, res) {
  try {
    const { id } = req.params;
    const {
      id_categoria,
      id_marca,
      nombre,
      descripcion,
      precio_compra,
      precio_venta,
      estado,
    } = req.body;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({
        ok: false,
        message: 'Producto no encontrado.',
      });
    }

    if (id_categoria) {
      const categoria = await Categoria.findByPk(id_categoria);
      if (!categoria) {
        return res.status(404).json({
          ok: false,
          message: 'Categoria no encontrada.',
        });
      }
    }

    if (id_marca) {
      const marca = await Marca.findByPk(id_marca);
      if (!marca) {
        return res.status(404).json({
          ok: false,
          message: 'Marca no encontrada.',
        });
      }
    }

    await producto.update({
      id_categoria: id_categoria ?? producto.id_categoria,
      id_marca: id_marca ?? producto.id_marca,
      nombre: nombre ?? producto.nombre,
      descripcion: descripcion ?? producto.descripcion,
      precio_compra: precio_compra ?? producto.precio_compra,
      precio_venta: precio_venta ?? producto.precio_venta,
      estado: estado ?? producto.estado,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: 'Producto actualizado correctamente.',
      data: producto,
    });
  } catch (error) {
    console.error('ERROR UPDATE PRODUCTO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar producto.',
      error: error.message,
    });
  }
}

async function deleteProducto(req, res) {
  try {
    const { id } = req.params;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({
        ok: false,
        message: 'Producto no encontrado.',
      });
    }

    await producto.update({
      estado: false,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: 'Producto desactivado correctamente.',
    });
  } catch (error) {
    console.error('ERROR DELETE PRODUCTO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al desactivar producto.',
      error: error.message,
    });
  }
}

async function changeProductoStatus(req, res) {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    const producto = await Producto.findByPk(id);

    if (!producto) {
      return res.status(404).json({
        ok: false,
        message: 'Producto no encontrado.',
      });
    }

    await producto.update({
      estado,
      updated_at: new Date(),
    });

    return res.status(200).json({
      ok: true,
      message: estado ? 'Producto activado correctamente.' : 'Producto desactivado correctamente.',
      data: producto,
    });
  } catch (error) {
    console.error('ERROR CHANGE PRODUCTO STATUS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al cambiar estado del producto.',
      error: error.message,
    });
  }
}

module.exports = {
  createProducto,
  getProductos,
  getProductoById,
  updateProducto,
  deleteProducto,
  changeProductoStatus,
};