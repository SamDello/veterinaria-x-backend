const { Stock, Producto, Almacen } = require('../models');

async function createStock(req, res) {
  try {
    const {
      id_producto,
      id_almacen,
      stock_actual,
      stock_minimo,
      stock_maximo,
    } = req.body;

    const producto = await Producto.findByPk(id_producto);
    if (!producto) {
      return res.status(404).json({
        ok: false,
        message: 'Producto no encontrado.',
      });
    }

    const almacen = await Almacen.findByPk(id_almacen);
    if (!almacen) {
      return res.status(404).json({
        ok: false,
        message: 'Almacén no encontrado.',
      });
    }

    if (!almacen.estado) {
      return res.status(400).json({
        ok: false,
        message: 'El almacén seleccionado está inactivo.',
      });
    }

    const existe = await Stock.findOne({
      where: { id_producto, id_almacen },
    });

    if (existe) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un registro de stock para ese producto en ese almacén.',
      });
    }

    const stock = await Stock.create({
      id_producto,
      id_almacen,
      stock_actual,
      stock_minimo: stock_minimo || 0,
      stock_maximo: stock_maximo || 0,
    });

    const stockCreado = await Stock.findByPk(stock.id_stock, {
      include: [
        { model: Producto, as: 'producto' },
        { model: Almacen, as: 'almacen' },
      ],
    });

    return res.status(201).json({
      ok: true,
      message: 'Stock registrado correctamente.',
      data: stockCreado,
    });
  } catch (error) {
    console.error('ERROR CREATE STOCK:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar stock.',
      error: error.message,
    });
  }
}

async function getStocks(req, res) {
  try {
    const stocks = await Stock.findAll({
      include: [
        { model: Producto, as: 'producto' },
        { model: Almacen, as: 'almacen' },
      ],
      order: [['id_stock', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: stocks,
    });
  } catch (error) {
    console.error('ERROR GET STOCKS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar stock.',
      error: error.message,
    });
  }
}

async function getStockById(req, res) {
  try {
    const { id } = req.params;

    const stock = await Stock.findByPk(id, {
      include: [
        { model: Producto, as: 'producto' },
        { model: Almacen, as: 'almacen' },
      ],
    });

    if (!stock) {
      return res.status(404).json({
        ok: false,
        message: 'Stock no encontrado.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: stock,
    });
  } catch (error) {
    console.error('ERROR GET STOCK BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener stock.',
      error: error.message,
    });
  }
}

async function updateStock(req, res) {
  try {
    const { id } = req.params;
    const {
      id_producto,
      id_almacen,
      stock_actual,
      stock_minimo,
      stock_maximo,
    } = req.body;

    const stock = await Stock.findByPk(id);

    if (!stock) {
      return res.status(404).json({
        ok: false,
        message: 'Stock no encontrado.',
      });
    }

    const producto = await Producto.findByPk(id_producto);
    if (!producto) {
      return res.status(404).json({
        ok: false,
        message: 'Producto no encontrado.',
      });
    }

    const almacen = await Almacen.findByPk(id_almacen);
    if (!almacen) {
      return res.status(404).json({
        ok: false,
        message: 'Almacén no encontrado.',
      });
    }

    const existe = await Stock.findOne({
      where: { id_producto, id_almacen },
    });

    if (existe && existe.id_stock !== stock.id_stock) {
      return res.status(409).json({
        ok: false,
        message: 'Ya existe un registro de stock para ese producto en ese almacén.',
      });
    }

    await stock.update({
      id_producto,
      id_almacen,
      stock_actual,
      stock_minimo: stock_minimo || 0,
      stock_maximo: stock_maximo || 0,
    });

    const stockActualizado = await Stock.findByPk(stock.id_stock, {
      include: [
        { model: Producto, as: 'producto' },
        { model: Almacen, as: 'almacen' },
      ],
    });

    return res.status(200).json({
      ok: true,
      message: 'Stock actualizado correctamente.',
      data: stockActualizado,
    });
  } catch (error) {
    console.error('ERROR UPDATE STOCK:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al actualizar stock.',
      error: error.message,
    });
  }
}

module.exports = {
  createStock,
  getStocks,
  getStockById,
  updateStock,
};