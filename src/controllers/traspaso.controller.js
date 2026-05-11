const {
  sequelize,
  Traspaso,
  TraspasoDetalle,
  Almacen,
  Empleado,
  Producto
} = require('../models');

const {
  registrarTraspasoProductoFIFO
} = require('../services/fifoInventario.service');

function toNumber(value) {
  const number = Number(value || 0);
  return Number.isNaN(number) ? 0 : number;
}

const createTraspaso = async (req, res) => {
  const transaction = await sequelize.transaction();

  try {
    const {
      id_almacen_origen,
      id_almacen_destino,
      id_empleado,
      observacion,
      detalles
    } = req.body;

    if (!id_almacen_origen || !id_almacen_destino) {
      await transaction.rollback();

      return res.status(400).json({
        ok: false,
        message: 'Almacén origen y almacén destino son obligatorios.'
      });
    }

    if (Number(id_almacen_origen) === Number(id_almacen_destino)) {
      await transaction.rollback();

      return res.status(400).json({
        ok: false,
        message: 'El almacén origen y destino no pueden ser el mismo.'
      });
    }

    if (!Array.isArray(detalles) || detalles.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        ok: false,
        message: 'Debe enviar al menos un producto para el traspaso.'
      });
    }

    const almacenOrigen = await Almacen.findByPk(id_almacen_origen, { transaction });

    if (!almacenOrigen) {
      await transaction.rollback();

      return res.status(404).json({
        ok: false,
        message: 'Almacén origen no encontrado.'
      });
    }

    const almacenDestino = await Almacen.findByPk(id_almacen_destino, { transaction });

    if (!almacenDestino) {
      await transaction.rollback();

      return res.status(404).json({
        ok: false,
        message: 'Almacén destino no encontrado.'
      });
    }

    if (id_empleado) {
      const empleado = await Empleado.findByPk(id_empleado, { transaction });

      if (!empleado) {
        await transaction.rollback();

        return res.status(404).json({
          ok: false,
          message: 'Empleado no encontrado.'
        });
      }
    }

    for (const item of detalles) {
      const cantidad = toNumber(item.cantidad);

      if (!item.id_producto || cantidad <= 0) {
        await transaction.rollback();

        return res.status(400).json({
          ok: false,
          message: 'Cada detalle debe tener producto y cantidad mayor a cero.'
        });
      }

      const producto = await Producto.findByPk(item.id_producto, { transaction });

      if (!producto) {
        await transaction.rollback();

        return res.status(404).json({
          ok: false,
          message: `Producto no encontrado con id ${item.id_producto}.`
        });
      }
    }

    const traspaso = await Traspaso.create(
      {
        id_almacen_origen,
        id_almacen_destino,
        id_empleado: id_empleado || null,
        fecha: new Date(),
        observacion: observacion || null,
        estado: 'REGISTRADO'
      },
      { transaction }
    );

    const detallesCreados = [];

    for (const item of detalles) {
      const cantidad = toNumber(item.cantidad);

      const detalleTraspaso = await TraspasoDetalle.create(
        {
          id_traspaso: traspaso.id_traspaso,
          id_producto: item.id_producto,
          cantidad,
          costo_total: 0
        },
        { transaction }
      );

      const resultadoFIFO = await registrarTraspasoProductoFIFO(
        {
          id_producto: item.id_producto,
          id_almacen_origen,
          id_almacen_destino,
          cantidad,
          id_empleado: id_empleado || null,
          id_traspaso: traspaso.id_traspaso,
          id_traspaso_detalle: detalleTraspaso.id_traspaso_detalle,
          observacion: observacion || 'Traspaso FIFO entre almacenes'
        },
        { transaction }
      );

      await detalleTraspaso.update(
        {
          costo_total: resultadoFIFO.costo_total
        },
        { transaction }
      );

      detallesCreados.push({
        ...detalleTraspaso.toJSON(),
        costo_total: resultadoFIFO.costo_total,
        fifo: resultadoFIFO
      });
    }

    await transaction.commit();

    const traspasoCreado = await Traspaso.findByPk(traspaso.id_traspaso, {
      include: [
        {
          model: Almacen,
          as: 'almacenOrigen'
        },
        {
          model: Almacen,
          as: 'almacenDestino'
        },
        {
          model: Empleado,
          as: 'empleado'
        },
        {
          model: TraspasoDetalle,
          as: 'detalles',
          include: [
            {
              model: Producto,
              as: 'producto'
            }
          ]
        }
      ]
    });

    return res.status(201).json({
      ok: true,
      message: 'Traspaso registrado correctamente con FIFO.',
      data: {
        traspaso: traspasoCreado,
        detalles: detallesCreados
      }
    });
  } catch (error) {
    await transaction.rollback();

    console.error('ERROR CREATE TRASPASO FIFO:', error);

    const erroresStock = [
      'Stock insuficiente',
      'No existe stock',
      'No existen lotes FIFO suficientes',
      'cantidad de salida'
    ];

    const esErrorStock = erroresStock.some((texto) =>
      String(error.message || '').includes(texto)
    );

    return res.status(esErrorStock ? 400 : 500).json({
      ok: false,
      message: esErrorStock
        ? error.message
        : 'Error al registrar traspaso FIFO.',
      error: error.message
    });
  }
};

const getTraspasos = async (req, res) => {
  try {
    const traspasos = await Traspaso.findAll({
      include: [
        {
          model: Almacen,
          as: 'almacenOrigen'
        },
        {
          model: Almacen,
          as: 'almacenDestino'
        },
        {
          model: Empleado,
          as: 'empleado'
        },
        {
          model: TraspasoDetalle,
          as: 'detalles',
          include: [
            {
              model: Producto,
              as: 'producto'
            }
          ]
        }
      ],
      order: [['id_traspaso', 'DESC']]
    });

    return res.status(200).json({
      ok: true,
      data: traspasos
    });
  } catch (error) {
    console.error('ERROR GET TRASPASOS:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar traspasos.',
      error: error.message
    });
  }
};

const getTraspasoById = async (req, res) => {
  try {
    const { id } = req.params;

    const traspaso = await Traspaso.findByPk(id, {
      include: [
        {
          model: Almacen,
          as: 'almacenOrigen'
        },
        {
          model: Almacen,
          as: 'almacenDestino'
        },
        {
          model: Empleado,
          as: 'empleado'
        },
        {
          model: TraspasoDetalle,
          as: 'detalles',
          include: [
            {
              model: Producto,
              as: 'producto'
            }
          ]
        }
      ]
    });

    if (!traspaso) {
      return res.status(404).json({
        ok: false,
        message: 'Traspaso no encontrado.'
      });
    }

    return res.status(200).json({
      ok: true,
      data: traspaso
    });
  } catch (error) {
    console.error('ERROR GET TRASPASO BY ID:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al obtener traspaso.',
      error: error.message
    });
  }
};

module.exports = {
  createTraspaso,
  getTraspasos,
  getTraspasoById
};