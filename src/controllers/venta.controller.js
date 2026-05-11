const {
  sequelize,
  Venta,
  DetalleVentaProducto,
  DetalleVentaServicio,
  Cliente,
  Empleado,
  Producto,
  ServicioVeterinario,
  Stock,
  Almacen,
  Mascota,
  AtencionVeterinaria,
  AtencionServicio,
} = require('../models');

const {
  registrarSalidaVentaFIFO
} = require('../services/fifoInventario.service');

function toNumber(value) {
  const number = Number(value || 0);
  return Number.isNaN(number) ? 0 : number;
}

function round2(value) {
  return Number(Number(value || 0).toFixed(2));
}

async function obtenerAlmacenParaVentaProducto({
  id_producto,
  id_almacen,
  cantidad,
  transaction
}) {
  if (id_almacen) {
    const stock = await Stock.findOne({
      where: {
        id_producto,
        id_almacen
      },
      transaction,
      lock: true
    });

    if (!stock || toNumber(stock.stock_actual) < cantidad) {
      return {
        ok: false,
        message: 'Stock insuficiente en el almacén seleccionado.'
      };
    }

    return {
      ok: true,
      id_almacen: Number(id_almacen),
      stock
    };
  }

  const stocks = await Stock.findAll({
    where: {
      id_producto
    },
    order: [['id_almacen', 'ASC']],
    transaction,
    lock: true
  });

  const stockDisponible = stocks.find((item) => {
    return toNumber(item.stock_actual) >= cantidad;
  });

  if (!stockDisponible) {
    return {
      ok: false,
      message: 'Stock insuficiente para el producto.'
    };
  }

  return {
    ok: true,
    id_almacen: stockDisponible.id_almacen,
    stock: stockDisponible
  };
}

async function createVentaProductos(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const {
      id_cliente,
      id_empleado,
      observacion,
      descuento,
      productos,
    } = req.body;

    const cliente = await Cliente.findByPk(id_cliente, { transaction });

    if (!cliente) {
      await transaction.rollback();

      return res.status(404).json({
        ok: false,
        message: 'Cliente no encontrado.',
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

    if (!Array.isArray(productos) || productos.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        ok: false,
        message: 'Debe enviar al menos un producto para la venta.',
      });
    }

    let subtotalGeneral = 0;
    const productosValidados = [];

    for (const item of productos) {
      const producto = await Producto.findByPk(item.id_producto, { transaction });

      if (!producto) {
        await transaction.rollback();

        return res.status(404).json({
          ok: false,
          message: `Producto no encontrado con id ${item.id_producto}.`,
        });
      }

      const cantidad = toNumber(item.cantidad);

      const precioUnitario = item.precio_unitario !== undefined &&
        item.precio_unitario !== null &&
        item.precio_unitario !== ''
        ? toNumber(item.precio_unitario)
        : toNumber(producto.precio_venta);

      if (cantidad <= 0) {
        await transaction.rollback();

        return res.status(400).json({
          ok: false,
          message: `La cantidad del producto ${producto.nombre} debe ser mayor a cero.`,
        });
      }

      if (precioUnitario < 0) {
        await transaction.rollback();

        return res.status(400).json({
          ok: false,
          message: `El precio unitario del producto ${producto.nombre} no puede ser negativo.`,
        });
      }

      const resultadoAlmacen = await obtenerAlmacenParaVentaProducto({
        id_producto: item.id_producto,
        id_almacen: item.id_almacen || null,
        cantidad,
        transaction
      });

      if (!resultadoAlmacen.ok) {
        await transaction.rollback();

        return res.status(400).json({
          ok: false,
          message: `${resultadoAlmacen.message} Producto: ${producto.nombre}.`,
        });
      }

      const subtotal = round2(cantidad * precioUnitario);
      subtotalGeneral = round2(subtotalGeneral + subtotal);

      productosValidados.push({
        id_producto: Number(item.id_producto),
        id_almacen: Number(resultadoAlmacen.id_almacen),
        cantidad,
        precio_unitario: precioUnitario,
        subtotal,
        producto
      });
    }

    const descuentoFinal = round2(descuento || 0);
    const totalGeneral = round2(subtotalGeneral - descuentoFinal);

    if (totalGeneral < 0) {
      await transaction.rollback();

      return res.status(400).json({
        ok: false,
        message: 'El descuento no puede ser mayor al subtotal de la venta.',
      });
    }

    const venta = await Venta.create(
      {
        id_cliente,
        id_empleado,
        id_atencion: null,
        observacion: observacion || null,
        subtotal: subtotalGeneral,
        descuento: descuentoFinal,
        total: totalGeneral,
        estado: true,
      },
      { transaction }
    );

    const detallesCreados = [];
    const movimientosFIFO = [];

    for (const item of productosValidados) {
      const detalleVentaProducto = await DetalleVentaProducto.create(
        {
          id_venta: venta.id_venta,
          id_producto: item.id_producto,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario,
          subtotal: item.subtotal,
        },
        { transaction }
      );

      detallesCreados.push(detalleVentaProducto);

      const resultadoFIFO = await registrarSalidaVentaFIFO(
        {
          id_producto: item.id_producto,
          id_almacen: item.id_almacen,
          cantidad: item.cantidad,
          id_empleado,

          id_venta: venta.id_venta,
          referencia_tipo: 'VENTA_PRODUCTO',
          referencia_id: venta.id_venta,
          observacion: 'Salida por venta de producto'
        },
        { transaction }
      );

      movimientosFIFO.push({
        id_producto: item.id_producto,
        id_almacen: item.id_almacen,
        cantidad: item.cantidad,
        costo_total: resultadoFIFO.costo_total,
        consumos: resultadoFIFO.consumos
      });
    }

    await transaction.commit();

    const ventaCreada = await Venta.findByPk(venta.id_venta, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Empleado, as: 'empleado' },
        {
          model: DetalleVentaProducto,
          as: 'detalleProductos',
          include: [{ model: Producto, as: 'producto' }],
        },
      ],
    });

    return res.status(201).json({
      ok: true,
      message: 'Venta de productos registrada correctamente con salida FIFO.',
      data: {
        venta: ventaCreada,
        detalles: detallesCreados,
        fifo: movimientosFIFO
      },
    });
  } catch (error) {
    await transaction.rollback();

    console.error('ERROR CREATE VENTA PRODUCTOS FIFO:', error);

    const erroresStock = [
      'Stock insuficiente',
      'No existe stock',
      'No existen lotes FIFO suficientes',
      'cantidad de salida'
    ];

    const esErrorStock = erroresStock.some((texto) => {
      return String(error.message || '').includes(texto);
    });

    return res.status(esErrorStock ? 400 : 500).json({
      ok: false,
      message: esErrorStock
        ? error.message
        : 'Error al registrar venta de productos.',
      error: error.message,
    });
  }
}

async function createVentaServicios(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const {
      id_cliente,
      id_empleado,
      id_atencion,
      observacion,
      descuento,
    } = req.body;

    const cliente = await Cliente.findByPk(id_cliente, { transaction });

    if (!cliente) {
      await transaction.rollback();

      return res.status(404).json({
        ok: false,
        message: 'Cliente no encontrado.',
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

    const atencion = await AtencionVeterinaria.findByPk(id_atencion, {
      include: [
        {
          model: Mascota,
          as: 'mascota',
        },
        {
          model: ServicioVeterinario,
          as: 'servicios',
          through: {
            attributes: ['cantidad', 'precio_unitario', 'subtotal', 'observacion'],
          },
        },
      ],
      transaction,
    });

    if (!atencion) {
      await transaction.rollback();

      return res.status(404).json({
        ok: false,
        message: 'Atención veterinaria no encontrada.',
      });
    }

    if (!atencion.estado) {
      await transaction.rollback();

      return res.status(400).json({
        ok: false,
        message: 'La atención veterinaria está inactiva.',
      });
    }

    if (atencion.estado_cobro !== 'PENDIENTE') {
      await transaction.rollback();

      return res.status(400).json({
        ok: false,
        message: 'La atención seleccionada ya fue cobrada o no está disponible para cobro.',
      });
    }

    if (!atencion.mascota || Number(atencion.mascota.id_cliente) !== Number(id_cliente)) {
      await transaction.rollback();

      return res.status(400).json({
        ok: false,
        message: 'La atención no pertenece al cliente seleccionado.',
      });
    }

    const detallesAtencion = await AtencionServicio.findAll({
      where: { id_atencion },
      transaction,
    });

    if (!detallesAtencion || detallesAtencion.length === 0) {
      await transaction.rollback();

      return res.status(400).json({
        ok: false,
        message: 'La atención no tiene servicios aplicados para cobrar.',
      });
    }

    const subtotalGeneral = detallesAtencion.reduce(
      (acc, item) => acc + Number(item.subtotal || 0),
      0
    );

    const descuentoFinal = Number(descuento || 0);
    const totalGeneral = subtotalGeneral - descuentoFinal;

    const venta = await Venta.create(
      {
        id_cliente,
        id_empleado,
        id_atencion,
        observacion: observacion || null,
        subtotal: subtotalGeneral,
        descuento: descuentoFinal,
        total: totalGeneral,
        estado: true,
      },
      { transaction }
    );

    for (const item of detallesAtencion) {
      await DetalleVentaServicio.create(
        {
          id_venta: venta.id_venta,
          id_servicio: item.id_servicio,
          cantidad: Number(item.cantidad || 1),
          precio_unitario: Number(item.precio_unitario || 0),
          subtotal: Number(item.subtotal || 0),
        },
        { transaction }
      );
    }

    await atencion.update(
      {
        estado_cobro: 'PAGADO',
        updated_at: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

    const ventaCreada = await Venta.findByPk(venta.id_venta, {
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Empleado, as: 'empleado' },
        {
          model: AtencionVeterinaria,
          as: 'atencion',
          include: [
            { model: Mascota, as: 'mascota' },
          ],
        },
        {
          model: DetalleVentaServicio,
          as: 'detalleServicios',
          include: [{ model: ServicioVeterinario, as: 'servicio' }],
        },
      ],
    });

    return res.status(201).json({
      ok: true,
      message: 'Venta de servicios registrada correctamente.',
      data: ventaCreada,
    });
  } catch (error) {
    await transaction.rollback();

    console.error('ERROR CREATE VENTA SERVICIOS:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al registrar venta de servicios.',
      error: error.message,
    });
  }
}

async function getMascotasByCliente(req, res) {
  try {
    const { id_cliente } = req.params;

    const cliente = await Cliente.findByPk(id_cliente);

    if (!cliente) {
      return res.status(404).json({
        ok: false,
        message: 'Cliente no encontrado.',
      });
    }

    const mascotas = await Mascota.findAll({
      where: {
        id_cliente,
        estado: true,
      },
      order: [['id_mascota', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: mascotas,
    });
  } catch (error) {
    console.error('ERROR GET MASCOTAS BY CLIENTE:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar mascotas del cliente.',
      error: error.message,
    });
  }
}

async function getAtencionesPendientesByMascota(req, res) {
  try {
    const { id_mascota } = req.params;

    const mascota = await Mascota.findByPk(id_mascota);

    if (!mascota) {
      return res.status(404).json({
        ok: false,
        message: 'Mascota no encontrada.',
      });
    }

    const atenciones = await AtencionVeterinaria.findAll({
      where: {
        id_mascota,
        estado: true,
        estado_cobro: 'PENDIENTE',
      },
      include: [
        {
          model: ServicioVeterinario,
          as: 'servicios',
          through: {
            attributes: ['cantidad', 'precio_unitario', 'subtotal', 'observacion'],
          },
        },
        {
          model: Mascota,
          as: 'mascota',
        },
        {
          model: Empleado,
          as: 'empleado',
        },
      ],
      order: [['fecha', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: atenciones,
    });
  } catch (error) {
    console.error('ERROR GET ATENCIONES PENDIENTES BY MASCOTA:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar atenciones pendientes de la mascota.',
      error: error.message,
    });
  }
}

async function getVentas(req, res) {
  try {
    const ventas = await Venta.findAll({
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Empleado, as: 'empleado' },
        {
          model: AtencionVeterinaria,
          as: 'atencion',
          include: [
            { model: Mascota, as: 'mascota' },
          ],
        },
        {
          model: DetalleVentaProducto,
          as: 'detalleProductos',
          include: [{ model: Producto, as: 'producto' }],
        },
        {
          model: DetalleVentaServicio,
          as: 'detalleServicios',
          include: [{ model: ServicioVeterinario, as: 'servicio' }],
        },
      ],
      order: [['id_venta', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: ventas,
    });
  } catch (error) {
    console.error('ERROR GET VENTAS:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al listar ventas.',
      error: error.message,
    });
  }
}

async function getStockAlmacenesByProducto(req, res) {
  try {
    const { id_producto } = req.params;

    const producto = await Producto.findByPk(id_producto);

    if (!producto) {
      return res.status(404).json({
        ok: false,
        message: 'Producto no encontrado.'
      });
    }

    const almacenes = await Almacen.findAll({
      where: {
        estado: true
      },
      order: [['id_almacen', 'ASC']]
    });

    const stocks = await Stock.findAll({
      where: {
        id_producto
      }
    });

    const stockMap = new Map();

    stocks.forEach((stock) => {
      stockMap.set(Number(stock.id_almacen), stock);
    });

    const data = almacenes.map((almacen) => {
      const stock = stockMap.get(Number(almacen.id_almacen));
      const stockActual = Number(stock?.stock_actual || 0);

      return {
        id_producto: Number(id_producto),
        producto: producto.nombre,
        id_almacen: almacen.id_almacen,
        almacen: almacen.nombre,
        stock_actual: stockActual,
        disponible: stockActual > 0
      };
    });

    return res.status(200).json({
      ok: true,
      data
    });
  } catch (error) {
    console.error('ERROR GET STOCK ALMACENES BY PRODUCTO:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al consultar stock por almacén.',
      error: error.message
    });
  }
}

module.exports = {
  createVentaProductos,
  createVentaServicios,
  getMascotasByCliente,
  getAtencionesPendientesByMascota,
  getStockAlmacenesByProducto,
  getVentas,
};