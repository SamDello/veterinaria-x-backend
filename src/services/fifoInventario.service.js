const {
  sequelize,
  Stock,
  MovimientoInventario,
  InventarioLote,
  InventarioLoteMovimiento
} = require('../models');

function toNumber(value) {
  const number = Number(value || 0);
  return Number.isNaN(number) ? 0 : number;
}

function round2(value) {
  return Number(Number(value || 0).toFixed(2));
}

async function ejecutarConTransaccion(transaction, callback) {
  if (transaction) {
    return callback(transaction);
  }

  return sequelize.transaction(async (t) => {
    return callback(t);
  });
}

async function obtenerOCrearStock(id_producto, id_almacen, transaction) {
  let stock = await Stock.findOne({
    where: {
      id_producto,
      id_almacen
    },
    transaction,
    lock: true
  });

  if (!stock) {
    stock = await Stock.create(
      {
        id_producto,
        id_almacen,
        stock_actual: 0,
        stock_minimo: 0,
        stock_maximo: 0
      },
      { transaction }
    );
  }

  return stock;
}

async function registrarMovimientoInventarioBasico({
  id_producto,
  id_almacen,
  id_empleado = null,
  tipo_movimiento,
  cantidad,
  motivo,
  referencia_tipo,
  referencia_id,
  stock_anterior,
  stock_nuevo,
  transaction
}) {
  if (!MovimientoInventario) {
    return null;
  }

  return MovimientoInventario.create(
    {
      id_producto,
      id_almacen,
      id_empleado,
      fecha: new Date(),
      tipo_movimiento,
      cantidad,
      motivo,
      referencia_tipo,
      referencia_id,
      stock_anterior,
      stock_nuevo
    },
    { transaction }
  );
}

async function registrarEntradaFIFO(params, options = {}) {
  const {
    id_producto,
    id_almacen,
    cantidad,
    costo_unitario,
    id_empleado = null,

    id_compra = null,
    id_detalle_compra = null,
    id_traspaso = null,
    id_traspaso_detalle = null,

    codigo_lote = null,
    fecha_vencimiento = null,

    tipo_lote_movimiento = 'ENTRADA_COMPRA',
    referencia_tipo = 'COMPRA',
    referencia_id = null,
    observacion = 'Entrada FIFO de inventario'
  } = params;

  return ejecutarConTransaccion(options.transaction, async (transaction) => {
    const cantidadEntrada = round2(cantidad);
    const costoUnitario = round2(costo_unitario);

    if (!id_producto || !id_almacen) {
      throw new Error('Producto y almacén son obligatorios para registrar entrada FIFO.');
    }

    if (cantidadEntrada <= 0) {
      throw new Error('La cantidad de entrada debe ser mayor a cero.');
    }

    const stock = await obtenerOCrearStock(id_producto, id_almacen, transaction);

    const stockAnterior = toNumber(stock.stock_actual);
    const stockNuevo = round2(stockAnterior + cantidadEntrada);

    const lote = await InventarioLote.create(
      {
        id_producto,
        id_almacen,
        id_compra,
        id_detalle_compra,
        id_traspaso,
        id_traspaso_detalle,
        codigo_lote,
        fecha_ingreso: new Date(),
        fecha_vencimiento,
        cantidad_inicial: cantidadEntrada,
        cantidad_disponible: cantidadEntrada,
        costo_unitario: costoUnitario,
        estado: 'DISPONIBLE'
      },
      { transaction }
    );

    await InventarioLoteMovimiento.create(
      {
        id_lote: lote.id_lote,
        id_producto,
        id_almacen_origen: null,
        id_almacen_destino: id_almacen,
        id_empleado,
        tipo: tipo_lote_movimiento,
        cantidad: cantidadEntrada,
        costo_unitario: costoUnitario,
        costo_total: round2(cantidadEntrada * costoUnitario),
        stock_lote_anterior: 0,
        stock_lote_nuevo: cantidadEntrada,
        referencia_tipo,
        referencia_id,
        observacion,
        fecha: new Date()
      },
      { transaction }
    );

    await stock.update(
      {
        stock_actual: stockNuevo
      },
      { transaction }
    );

    await registrarMovimientoInventarioBasico({
      id_producto,
      id_almacen,
      id_empleado,
      tipo_movimiento: 'INGRESO',
      cantidad: cantidadEntrada,
      motivo: observacion,
      referencia_tipo,
      referencia_id,
      stock_anterior: stockAnterior,
      stock_nuevo: stockNuevo,
      transaction
    });

    return {
      lote,
      stock_anterior: stockAnterior,
      stock_nuevo: stockNuevo
    };
  });
}

async function registrarSalidaFIFO(params, options = {}) {
  const {
    id_producto,
    id_almacen,
    cantidad,
    id_empleado = null,

    tipo_lote_movimiento = 'SALIDA_VENTA',
    referencia_tipo = 'VENTA_PRODUCTO',
    referencia_id = null,
    observacion = 'Salida FIFO de inventario'
  } = params;

  return ejecutarConTransaccion(options.transaction, async (transaction) => {
    const cantidadSolicitada = round2(cantidad);

    if (!id_producto || !id_almacen) {
      throw new Error('Producto y almacén son obligatorios para registrar salida FIFO.');
    }

    if (cantidadSolicitada <= 0) {
      throw new Error('La cantidad de salida debe ser mayor a cero.');
    }

    const stock = await Stock.findOne({
      where: {
        id_producto,
        id_almacen
      },
      transaction,
      lock: true
    });

    if (!stock) {
      throw new Error('No existe stock para este producto en el almacén seleccionado.');
    }

    const stockAnterior = toNumber(stock.stock_actual);

    if (stockAnterior < cantidadSolicitada) {
      throw new Error(
        `Stock insuficiente. Disponible: ${stockAnterior}. Solicitado: ${cantidadSolicitada}.`
      );
    }

    const lotes = await InventarioLote.findAll({
      where: {
        id_producto,
        id_almacen,
        estado: 'DISPONIBLE'
      },
      order: [
        ['fecha_ingreso', 'ASC'],
        ['id_lote', 'ASC']
      ],
      transaction,
      lock: true
    });

    let restante = cantidadSolicitada;
    const consumos = [];

    for (const lote of lotes) {
      if (restante <= 0) break;

      const disponible = toNumber(lote.cantidad_disponible);

      if (disponible <= 0) continue;

      const cantidadConsumida = round2(Math.min(disponible, restante));
      const nuevoDisponible = round2(disponible - cantidadConsumida);
      const costoUnitario = round2(lote.costo_unitario);
      const costoTotal = round2(cantidadConsumida * costoUnitario);

      await lote.update(
        {
          cantidad_disponible: nuevoDisponible,
          estado: nuevoDisponible <= 0 ? 'AGOTADO' : 'DISPONIBLE'
        },
        { transaction }
      );

      await InventarioLoteMovimiento.create(
        {
          id_lote: lote.id_lote,
          id_producto,
          id_almacen_origen: id_almacen,
          id_almacen_destino: null,
          id_empleado,
          tipo: tipo_lote_movimiento,
          cantidad: cantidadConsumida,
          costo_unitario: costoUnitario,
          costo_total: costoTotal,
          stock_lote_anterior: disponible,
          stock_lote_nuevo: nuevoDisponible,
          referencia_tipo,
          referencia_id,
          observacion,
          fecha: new Date()
        },
        { transaction }
      );

      consumos.push({
        id_lote: lote.id_lote,
        id_producto,
        id_almacen,
        cantidad: cantidadConsumida,
        costo_unitario: costoUnitario,
        costo_total: costoTotal
      });

      restante = round2(restante - cantidadConsumida);
    }

    if (restante > 0) {
      throw new Error(
        `No existen lotes FIFO suficientes. Faltan ${restante} unidades por cubrir.`
      );
    }

    const stockNuevo = round2(stockAnterior - cantidadSolicitada);

    await stock.update(
      {
        stock_actual: stockNuevo
      },
      { transaction }
    );

    await registrarMovimientoInventarioBasico({
      id_producto,
      id_almacen,
      id_empleado,
      tipo_movimiento: 'SALIDA',
      cantidad: cantidadSolicitada,
      motivo: observacion,
      referencia_tipo,
      referencia_id,
      stock_anterior: stockAnterior,
      stock_nuevo: stockNuevo,
      transaction
    });

    return {
      consumos,
      stock_anterior: stockAnterior,
      stock_nuevo: stockNuevo,
      costo_total: round2(
        consumos.reduce((acc, item) => acc + toNumber(item.costo_total), 0)
      )
    };
  });
}

async function registrarSalidaVentaFIFO(params, options = {}) {
  return registrarSalidaFIFO(
    {
      ...params,
      tipo_lote_movimiento: 'SALIDA_VENTA',
      referencia_tipo: params.referencia_tipo || 'VENTA_PRODUCTO',
      referencia_id: params.referencia_id || params.id_venta || null,
      observacion: params.observacion || 'Salida por venta de producto'
    },
    options
  );
}

async function registrarTraspasoProductoFIFO(params, options = {}) {
  const {
    id_producto,
    id_almacen_origen,
    id_almacen_destino,
    cantidad,
    id_empleado = null,
    id_traspaso = null,
    id_traspaso_detalle = null,
    observacion = 'Traspaso FIFO entre almacenes'
  } = params;

  return ejecutarConTransaccion(options.transaction, async (transaction) => {
    if (!id_almacen_origen || !id_almacen_destino) {
      throw new Error('Almacén origen y almacén destino son obligatorios.');
    }

    if (Number(id_almacen_origen) === Number(id_almacen_destino)) {
      throw new Error('El almacén origen y destino no pueden ser el mismo.');
    }

    const salida = await registrarSalidaFIFO(
      {
        id_producto,
        id_almacen: id_almacen_origen,
        cantidad,
        id_empleado,
        tipo_lote_movimiento: 'TRASPASO_SALIDA',
        referencia_tipo: 'TRASPASO',
        referencia_id: id_traspaso,
        observacion
      },
      { transaction }
    );

    const entradas = [];

    for (const consumo of salida.consumos) {
      const entrada = await registrarEntradaFIFO(
        {
          id_producto,
          id_almacen: id_almacen_destino,
          cantidad: consumo.cantidad,
          costo_unitario: consumo.costo_unitario,
          id_empleado,
          id_traspaso,
          id_traspaso_detalle,
          codigo_lote: `TRASP-${id_traspaso || 'TEMP'}-LOTE-${consumo.id_lote}`,
          tipo_lote_movimiento: 'TRASPASO_ENTRADA',
          referencia_tipo: 'TRASPASO',
          referencia_id: id_traspaso,
          observacion
        },
        { transaction }
      );

      entradas.push(entrada);
    }

    return {
      salida,
      entradas,
      costo_total: salida.costo_total
    };
  });
}

async function inicializarLotesDesdeStock(options = {}) {
  return ejecutarConTransaccion(options.transaction, async (transaction) => {
    const stocks = await Stock.findAll({
      transaction,
      lock: true
    });

    const resultados = [];

    for (const stock of stocks) {
      const id_producto = stock.id_producto;
      const id_almacen = stock.id_almacen;
      const stockActual = toNumber(stock.stock_actual);

      if (stockActual <= 0) continue;

      const existeLote = await InventarioLote.findOne({
        where: {
          id_producto,
          id_almacen
        },
        transaction,
        lock: true
      });

      if (existeLote) continue;

      const lote = await InventarioLote.create(
        {
          id_producto,
          id_almacen,
          codigo_lote: `INICIAL-${id_producto}-${id_almacen}`,
          fecha_ingreso: new Date(),
          cantidad_inicial: stockActual,
          cantidad_disponible: stockActual,
          costo_unitario: 0,
          estado: 'DISPONIBLE'
        },
        { transaction }
      );

      await InventarioLoteMovimiento.create(
        {
          id_lote: lote.id_lote,
          id_producto,
          id_almacen_origen: null,
          id_almacen_destino: id_almacen,
          id_empleado: null,
          tipo: 'AJUSTE_ENTRADA',
          cantidad: stockActual,
          costo_unitario: 0,
          costo_total: 0,
          stock_lote_anterior: 0,
          stock_lote_nuevo: stockActual,
          referencia_tipo: 'STOCK_INICIAL',
          referencia_id: stock.id_stock,
          observacion: 'Lote inicial generado desde stock existente',
          fecha: new Date()
        },
        { transaction }
      );

      resultados.push({
        id_producto,
        id_almacen,
        id_lote: lote.id_lote,
        cantidad: stockActual
      });
    }

    return resultados;
  });
}

module.exports = {
  registrarEntradaFIFO,
  registrarSalidaFIFO,
  registrarSalidaVentaFIFO,
  registrarTraspasoProductoFIFO,
  inicializarLotesDesdeStock
};