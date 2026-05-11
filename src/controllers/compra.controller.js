const {
  sequelize,
  Compra,
  DetalleCompra,
  Proveedor,
  Empleado,
  Almacen,
  Producto,
  Stock,
  MovimientoInventario,
} = require('../models');
const { registrarEntradaFIFO } = require('../services/fifoInventario.service');

const createCompra = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      id_proveedor,
      id_empleado,
      id_almacen,
      observacion,
      detalles
    } = req.body;

    if (!id_proveedor || !id_empleado || !id_almacen) {
      await transaction.rollback();

      return res.status(400).json({
        ok: false,
        message: 'Proveedor, empleado y almacén son obligatorios.'
      });
    }

    if (!Array.isArray(detalles) || detalles.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        ok: false,
        message: 'Debe enviar al menos un producto en el detalle de compra.'
      });
    }

    let subtotal = 0;

    for (const item of detalles) {
      const cantidad = Number(item.cantidad || 0);
      const costoUnitario = Number(item.costo_unitario || 0);

      if (!item.id_producto || cantidad <= 0 || costoUnitario < 0) {
        await transaction.rollback();

        return res.status(400).json({
          ok: false,
          message: 'Cada detalle debe tener producto, cantidad válida y costo unitario válido.'
        });
      }

      subtotal += cantidad * costoUnitario;
    }

    subtotal = Number(subtotal.toFixed(2));
    const total = subtotal;

    const compra = await Compra.create(
      {
        id_proveedor,
        id_empleado,
        id_almacen,
        fecha: new Date(),
        observacion: observacion || null,
        subtotal,
        total,
        estado: true
      },
      { transaction }
    );

    const detallesCreados = [];

    for (const item of detalles) {
      const cantidad = Number(item.cantidad || 0);
      const costoUnitario = Number(item.costo_unitario || 0);
      const subtotalDetalle = Number((cantidad * costoUnitario).toFixed(2));

      const detalleCompra = await DetalleCompra.create(
        {
          id_compra: compra.id_compra,
          id_producto: item.id_producto,
          cantidad,
          costo_unitario: costoUnitario,
          subtotal: subtotalDetalle
        },
        { transaction }
      );

      detallesCreados.push(detalleCompra);

      await registrarEntradaFIFO(
        {
          id_producto: item.id_producto,
          id_almacen,
          cantidad,
          costo_unitario: costoUnitario,
          id_empleado,

          id_compra: compra.id_compra,
          id_detalle_compra: detalleCompra.id_detalle_compra,

          codigo_lote: `COMPRA-${compra.id_compra}-DET-${detalleCompra.id_detalle_compra}`,

          tipo_lote_movimiento: 'ENTRADA_COMPRA',
          referencia_tipo: 'COMPRA',
          referencia_id: compra.id_compra,
          observacion: 'Ingreso por compra'
        },
        { transaction }
      );
    }

    await transaction.commit();

    return res.status(201).json({
      ok: true,
      message: 'Compra registrada correctamente con lote FIFO.',
      data: {
        ...compra.toJSON(),
        detalles: detallesCreados
      }
    });
  } catch (error) {
    await transaction.rollback();

    console.error('Error al registrar compra:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al registrar compra.',
      error: error.message
    });
  }
};

async function getCompras(req, res) {
  try {
    const compras = await Compra.findAll({
      include: [
        {
          model: Proveedor,
          as: 'proveedor',
        },
        {
          model: Empleado,
          as: 'empleado',
        },
        {
          model: Almacen,
          as: 'almacen',
        },
        {
          model: DetalleCompra,
          as: 'detalles',
          include: [
            {
              model: Producto,
              as: 'producto',
            },
          ],
        },
      ],
      order: [['id_compra', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: compras,
    });
  } catch (error) {
    console.error('ERROR GET COMPRAS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar compras.',
      error: error.message,
    });
  }
}

async function getCompraById(req, res) {
  try {
    const { id } = req.params;

    const compra = await Compra.findByPk(id, {
      include: [
        {
          model: Proveedor,
          as: 'proveedor',
        },
        {
          model: Empleado,
          as: 'empleado',
        },
        {
          model: Almacen,
          as: 'almacen',
        },
        {
          model: DetalleCompra,
          as: 'detalles',
          include: [
            {
              model: Producto,
              as: 'producto',
            },
          ],
        },
      ],
    });

    if (!compra) {
      return res.status(404).json({
        ok: false,
        message: 'Compra no encontrada.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: compra,
    });
  } catch (error) {
    console.error('ERROR GET COMPRA BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener compra.',
      error: error.message,
    });
  }
}

module.exports = {
  createCompra,
  getCompras,
  getCompraById,
};