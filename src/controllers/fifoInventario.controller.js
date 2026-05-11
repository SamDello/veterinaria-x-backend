const {
  InventarioLote,
  InventarioLoteMovimiento,
  Producto,
  Almacen
} = require('../models');

const {
  inicializarLotesDesdeStock
} = require('../services/fifoInventario.service');

const inicializarLotes = async (req, res) => {
  try {
    const resultados = await inicializarLotesDesdeStock();

    return res.status(200).json({
      ok: true,
      message: 'Lotes FIFO inicializados correctamente desde el stock actual.',
      data: resultados
    });
  } catch (error) {
    console.error('Error al inicializar lotes FIFO:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al inicializar lotes FIFO.',
      error: error.message
    });
  }
};

const listarLotes = async (req, res) => {
  try {
    const lotes = await InventarioLote.findAll({
      include: [
        {
          model: Producto,
          as: 'producto',
          attributes: ['id_producto', 'nombre']
        },
        {
          model: Almacen,
          as: 'almacen',
          attributes: ['id_almacen', 'nombre']
        }
      ],
      order: [
        ['id_producto', 'ASC'],
        ['id_almacen', 'ASC'],
        ['fecha_ingreso', 'ASC'],
        ['id_lote', 'ASC']
      ]
    });

    return res.status(200).json({
      ok: true,
      data: lotes
    });
  } catch (error) {
    console.error('Error al listar lotes FIFO:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar lotes FIFO.',
      error: error.message
    });
  }
};

const listarMovimientosLote = async (req, res) => {
  try {
    const movimientos = await InventarioLoteMovimiento.findAll({
      include: [
        {
          model: Producto,
          as: 'producto',
          attributes: ['id_producto', 'nombre']
        },
        {
          model: InventarioLote,
          as: 'lote'
        },
        {
          model: Almacen,
          as: 'almacenOrigen',
          attributes: ['id_almacen', 'nombre']
        },
        {
          model: Almacen,
          as: 'almacenDestino',
          attributes: ['id_almacen', 'nombre']
        }
      ],
      order: [
        ['fecha', 'DESC'],
        ['id_lote_movimiento', 'DESC']
      ]
    });

    return res.status(200).json({
      ok: true,
      data: movimientos
    });
  } catch (error) {
    console.error('Error al listar movimientos FIFO:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar movimientos FIFO.',
      error: error.message
    });
  }
};

module.exports = {
  inicializarLotes,
  listarLotes,
  listarMovimientosLote
};