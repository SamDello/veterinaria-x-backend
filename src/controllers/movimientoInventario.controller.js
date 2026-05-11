const {
  MovimientoInventario,
  Producto,
  Almacen,
  Empleado,
  Stock,
  sequelize,
} = require('../models');

async function createMovimientoInventario(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const {
      id_producto,
      id_almacen,
      id_empleado,
      tipo_movimiento,
      cantidad,
      motivo,
      referencia_tipo,
      referencia_id,
      fecha,
    } = req.body;

    const producto = await Producto.findByPk(id_producto, { transaction });
    if (!producto) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        message: 'Producto no encontrado.',
      });
    }

    const almacen = await Almacen.findByPk(id_almacen, { transaction });
    if (!almacen) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        message: 'Almacén no encontrado.',
      });
    }

    if (!almacen.estado) {
      await transaction.rollback();
      return res.status(400).json({
        ok: false,
        message: 'El almacén seleccionado está inactivo.',
      });
    }

    const empleado = await Empleado.findByPk(id_empleado, { transaction });
    if (!empleado) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        message: 'Empleado no encontrado.',
      });
    }

    let stock = await Stock.findOne({
      where: { id_producto, id_almacen },
      transaction,
    });

    if (!stock) {
      if (tipo_movimiento === 'SALIDA') {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: 'No existe stock registrado para este producto en ese almacén.',
        });
      }

      stock = await Stock.create(
        {
          id_producto,
          id_almacen,
          stock_actual: 0,
          stock_minimo: 0,
          stock_maximo: 0,
        },
        { transaction }
      );
    }

    const stockAnterior = Number(stock.stock_actual || 0);
    const cantidadMovimiento = Number(cantidad || 0);

    let stockNuevo = stockAnterior;

    if (tipo_movimiento === 'INGRESO') {
      stockNuevo = stockAnterior + cantidadMovimiento;
    } else if (tipo_movimiento === 'SALIDA') {
      if (cantidadMovimiento > stockAnterior) {
        await transaction.rollback();
        return res.status(400).json({
          ok: false,
          message: 'La cantidad de salida no puede ser mayor al stock actual.',
        });
      }

      stockNuevo = stockAnterior - cantidadMovimiento;
    } else if (tipo_movimiento === 'AJUSTE') {
      stockNuevo = cantidadMovimiento;
    } else {
      await transaction.rollback();
      return res.status(400).json({
        ok: false,
        message: 'Tipo de movimiento inválido.',
      });
    }

    const movimiento = await MovimientoInventario.create(
      {
        id_producto,
        id_almacen,
        id_empleado,
        fecha: fecha ? new Date(fecha) : new Date(),
        tipo_movimiento,
        cantidad: cantidadMovimiento,
        motivo: motivo || null,
        referencia_tipo: referencia_tipo || null,
        referencia_id: referencia_id || null,
        stock_anterior: stockAnterior,
        stock_nuevo: stockNuevo,
      },
      { transaction }
    );

    await stock.update(
      {
        stock_actual: stockNuevo,
      },
      { transaction }
    );

    await transaction.commit();

    const movimientoCreado = await MovimientoInventario.findByPk(
      movimiento.id_movimiento_inventario,
      {
        include: [
          { model: Producto, as: 'producto' },
          { model: Almacen, as: 'almacen' },
          { model: Empleado, as: 'empleado' },
        ],
      }
    );

    return res.status(201).json({
      ok: true,
      message: 'Movimiento de inventario registrado correctamente.',
      data: {
        movimiento: movimientoCreado,
        stock_actualizado: {
          id_stock: stock.id_stock,
          stock_actual: stockNuevo,
        },
      },
    });
  } catch (error) {
    await transaction.rollback();
    console.error('ERROR CREATE MOVIMIENTO INVENTARIO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar movimiento de inventario.',
      error: error.message,
    });
  }
}

async function getMovimientosInventario(req, res) {
  try {
    const movimientos = await MovimientoInventario.findAll({
      include: [
        { model: Producto, as: 'producto' },
        { model: Almacen, as: 'almacen' },
        { model: Empleado, as: 'empleado' },
      ],
      order: [['fecha', 'DESC'], ['id_movimiento_inventario', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: movimientos,
    });
  } catch (error) {
    console.error('ERROR GET MOVIMIENTOS INVENTARIO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar movimientos de inventario.',
      error: error.message,
    });
  }
}

async function getMovimientoInventarioById(req, res) {
  try {
    const { id } = req.params;

    const movimiento = await MovimientoInventario.findByPk(id, {
      include: [
        { model: Producto, as: 'producto' },
        { model: Almacen, as: 'almacen' },
        { model: Empleado, as: 'empleado' },
      ],
    });

    if (!movimiento) {
      return res.status(404).json({
        ok: false,
        message: 'Movimiento de inventario no encontrado.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: movimiento,
    });
  } catch (error) {
    console.error('ERROR GET MOVIMIENTO INVENTARIO BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener movimiento de inventario.',
      error: error.message,
    });
  }
}

module.exports = {
  createMovimientoInventario,
  getMovimientosInventario,
  getMovimientoInventarioById,
};