const { Op } = require('sequelize');
const {
  Venta,
  Compra,
  Stock,
  Almacen,
  Producto,
  AtencionVeterinaria,
  Mascota,
  Cliente,
  Empleado,
  Pago,
  MetodoPago,
} = require('../models');

async function getReporteVentas(req, res) {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    const where = {};

    if (fecha_inicio && fecha_fin) {
      where.fecha = {
        [Op.between]: [
          new Date(`${fecha_inicio} 00:00:00`),
          new Date(`${fecha_fin} 23:59:59`),
        ],
      };
    }

    const ventas = await Venta.findAll({
      where,
      include: [
        { model: Cliente, as: 'cliente' },
        { model: Empleado, as: 'empleado' },
      ],
      order: [['fecha', 'DESC']],
    });

    const totalVentas = ventas.reduce((acc, item) => acc + Number(item.total), 0);

    return res.status(200).json({
      ok: true,
      total_registros: ventas.length,
      total_ventas: totalVentas,
      data: ventas,
    });
  } catch (error) {
    console.error('ERROR REPORTE VENTAS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al generar reporte de ventas.',
      error: error.message,
    });
  }
}

async function getReporteCompras(req, res) {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    const where = {};

    if (fecha_inicio && fecha_fin) {
      where.fecha = {
        [Op.between]: [
          new Date(`${fecha_inicio} 00:00:00`),
          new Date(`${fecha_fin} 23:59:59`),
        ],
      };
    }

    const compras = await Compra.findAll({
      where,
      include: [
        { model: Empleado, as: 'empleado' },
        { model: Almacen, as: 'almacen' },
      ],
      order: [['fecha', 'DESC']],
    });

    const totalCompras = compras.reduce((acc, item) => acc + Number(item.total), 0);

    return res.status(200).json({
      ok: true,
      total_registros: compras.length,
      total_compras: totalCompras,
      data: compras,
    });
  } catch (error) {
    console.error('ERROR REPORTE COMPRAS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al generar reporte de compras.',
      error: error.message,
    });
  }
}

async function getReporteStock(req, res) {
  try {
    const { id_almacen, stock_bajo } = req.query;

    const where = {};

    if (id_almacen) {
      where.id_almacen = id_almacen;
    }

    const stocks = await Stock.findAll({
      where,
      include: [
        { model: Producto, as: 'producto' },
        { model: Almacen, as: 'almacen' },
      ],
      order: [['id_stock', 'DESC']],
    });

    let data = stocks;

    if (stock_bajo === 'true') {
      data = stocks.filter((item) => Number(item.stock_actual) <= Number(item.stock_minimo));
    }

    return res.status(200).json({
      ok: true,
      total_registros: data.length,
      data,
    });
  } catch (error) {
    console.error('ERROR REPORTE STOCK:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al generar reporte de stock.',
      error: error.message,
    });
  }
}

async function getReporteAtenciones(req, res) {
  try {
    const { fecha_inicio, fecha_fin, id_mascota } = req.query;

    const where = {};

    if (fecha_inicio && fecha_fin) {
      where.fecha = {
        [Op.between]: [
          new Date(`${fecha_inicio} 00:00:00`),
          new Date(`${fecha_fin} 23:59:59`),
        ],
      };
    }

    if (id_mascota) {
      where.id_mascota = id_mascota;
    }

    const atenciones = await AtencionVeterinaria.findAll({
      where,
      include: [
        {
          model: Mascota,
          as: 'mascota',
          include: [
            {
              model: Cliente,
              as: 'cliente',
            },
          ],
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
      total_registros: atenciones.length,
      data: atenciones,
    });
  } catch (error) {
    console.error('ERROR REPORTE ATENCIONES:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al generar reporte de atenciones.',
      error: error.message,
    });
  }
}

async function getReportePagos(req, res) {
  try {
    const { fecha_inicio, fecha_fin, estado_pago } = req.query;

    const where = {};

    if (fecha_inicio && fecha_fin) {
      where.fecha = {
        [Op.between]: [
          new Date(`${fecha_inicio} 00:00:00`),
          new Date(`${fecha_fin} 23:59:59`),
        ],
      };
    }

    if (estado_pago) {
      where.estado = estado_pago;
    }

    const pagos = await Pago.findAll({
      where,
      include: [
        {
          model: MetodoPago,
          as: 'metodoPago',
        },
        {
          model: Venta,
          as: 'venta',
          include: [
            {
              model: Cliente,
              as: 'cliente',
            },
            {
              model: Empleado,
              as: 'empleado',
            },
          ],
        },
      ],
      order: [['fecha', 'DESC']],
    });

    const resumenEstados = {
      pagado: 0,
      pendiente: 0,
      anulado: 0,
      expirado: 0,
    };

    let totalPagos = 0;

    pagos.forEach((pago) => {
      const estado = String(pago.estado || '').toUpperCase();

      if (estado === 'PAGADO') resumenEstados.pagado++;
      if (estado === 'PENDIENTE') resumenEstados.pendiente++;
      if (estado === 'ANULADO') resumenEstados.anulado++;
      if (estado === 'EXPIRADO') resumenEstados.expirado++;

      totalPagos += Number(pago.monto || 0);
    });

    return res.status(200).json({
      ok: true,
      total_registros: pagos.length,
      total_pagos: totalPagos,
      resumen_estados: resumenEstados,
      data: pagos,
    });
  } catch (error) {
    console.error('ERROR REPORTE PAGOS:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al generar reporte de pagos.',
      error: error.message,
    });
  }
}

module.exports = {
  getReporteVentas,
  getReporteCompras,
  getReporteStock,
  getReporteAtenciones,
  getReportePagos,
};