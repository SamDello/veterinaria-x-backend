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

const {
  streamReportPdf,
  formatDate,
  formatMoney,
} = require('../services/reportPdf.service');

function fullName(person) {
  if (!person) return '-';
  return `${person.nombre || ''} ${person.apellidos || ''}`.trim() || '-';
}

function buildSubtitle(fecha_inicio, fecha_fin) {
  if (fecha_inicio && fecha_fin) {
    return `Periodo: ${fecha_inicio} al ${fecha_fin}`;
  }

  return 'Periodo: todos los registros disponibles';
}

async function exportReporteVentasPdf(req, res) {
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

    const rows = ventas.map((venta) => ({
      id: venta.id_venta,
      fecha: formatDate(venta.fecha),
      cliente: fullName(venta.cliente),
      empleado: fullName(venta.empleado),
      subtotal: formatMoney(venta.subtotal),
      descuento: formatMoney(venta.descuento),
      total: formatMoney(venta.total),
    }));

    const totalVentas = ventas.reduce((acc, item) => acc + Number(item.total || 0), 0);

    streamReportPdf(res, 'reporte-ventas.pdf', {
      title: 'Reporte de Ventas',
      subtitle: buildSubtitle(fecha_inicio, fecha_fin),
      summary: [
        { label: 'Total registros', value: ventas.length },
        { label: 'Total ventas', value: formatMoney(totalVentas) },
      ],
      columns: [
        { key: 'id', label: 'ID', width: 45 },
        { key: 'fecha', label: 'Fecha', width: 105 },
        { key: 'cliente', label: 'Cliente', width: 160 },
        { key: 'empleado', label: 'Empleado', width: 160 },
        { key: 'subtotal', label: 'Subtotal', width: 90 },
        { key: 'descuento', label: 'Descuento', width: 90 },
        { key: 'total', label: 'Total', width: 90 },
      ],
      rows,
    });
  } catch (error) {
    console.error('ERROR PDF REPORTE VENTAS:', error);

    res.status(500).json({
      ok: false,
      message: 'Error al generar PDF de ventas.',
      error: error.message,
    });
  }
}

async function exportReporteComprasPdf(req, res) {
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

    const rows = compras.map((compra) => ({
      id: compra.id_compra,
      fecha: formatDate(compra.fecha),
      empleado: fullName(compra.empleado),
      almacen: compra.almacen?.nombre || '-',
      subtotal: formatMoney(compra.subtotal),
      total: formatMoney(compra.total),
    }));

    const totalCompras = compras.reduce((acc, item) => acc + Number(item.total || 0), 0);

    streamReportPdf(res, 'reporte-compras.pdf', {
      title: 'Reporte de Compras',
      subtitle: buildSubtitle(fecha_inicio, fecha_fin),
      summary: [
        { label: 'Total registros', value: compras.length },
        { label: 'Total compras', value: formatMoney(totalCompras) },
      ],
      columns: [
        { key: 'id', label: 'ID', width: 45 },
        { key: 'fecha', label: 'Fecha', width: 120 },
        { key: 'empleado', label: 'Empleado', width: 180 },
        { key: 'almacen', label: 'Almacén', width: 180 },
        { key: 'subtotal', label: 'Subtotal', width: 100 },
        { key: 'total', label: 'Total', width: 100 },
      ],
      rows,
    });
  } catch (error) {
    console.error('ERROR PDF REPORTE COMPRAS:', error);

    res.status(500).json({
      ok: false,
      message: 'Error al generar PDF de compras.',
      error: error.message,
    });
  }
}

async function exportReporteStockPdf(req, res) {
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

    const rows = data.map((item) => ({
      id: item.id_stock,
      producto: item.producto?.nombre || '-',
      almacen: item.almacen?.nombre || '-',
      actual: item.stock_actual,
      minimo: item.stock_minimo,
      maximo: item.stock_maximo,
      estado: Number(item.stock_actual) <= Number(item.stock_minimo) ? 'STOCK BAJO' : 'NORMAL',
    }));

    streamReportPdf(res, 'reporte-stock.pdf', {
      title: 'Reporte de Stock',
      subtitle: stock_bajo === 'true'
        ? 'Filtro aplicado: solo stock bajo'
        : 'Filtro aplicado: stock general',
      summary: [
        { label: 'Total registros', value: data.length },
      ],
      columns: [
        { key: 'id', label: 'ID', width: 40 },
        { key: 'producto', label: 'Producto', width: 205 },
        { key: 'almacen', label: 'Almacén', width: 150 },
        { key: 'actual', label: 'Stock actual', width: 85 },
        { key: 'minimo', label: 'Stock mínimo', width: 85 },
        { key: 'maximo', label: 'Stock máximo', width: 85 },
        { key: 'estado', label: 'Estado', width: 85 },
      ],
      rows,
    });
  } catch (error) {
    console.error('ERROR PDF REPORTE STOCK:', error);

    res.status(500).json({
      ok: false,
      message: 'Error al generar PDF de stock.',
      error: error.message,
    });
  }
}

async function exportReporteAtencionesPdf(req, res) {
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

    const rows = atenciones.map((item) => ({
      id: item.id_atencion,
      fecha: formatDate(item.fecha),
      mascota: item.mascota?.nombre || '-',
      cliente: item.mascota?.cliente ? fullName(item.mascota.cliente) : '-',
      empleado: fullName(item.empleado),
      motivo: item.motivo_consulta || '-',
      diagnostico: item.diagnostico || '-',
    }));

    streamReportPdf(res, 'reporte-atenciones.pdf', {
      title: 'Reporte de Atenciones Veterinarias',
      subtitle: buildSubtitle(fecha_inicio, fecha_fin),
      summary: [
        { label: 'Total registros', value: atenciones.length },
      ],
      columns: [
        { key: 'id', label: 'ID', width: 40 },
        { key: 'fecha', label: 'Fecha', width: 95 },
        { key: 'mascota', label: 'Mascota', width: 85 },
        { key: 'cliente', label: 'Cliente', width: 120 },
        { key: 'empleado', label: 'Empleado', width: 120 },
        { key: 'motivo', label: 'Motivo', width: 145 },
        { key: 'diagnostico', label: 'Diagnóstico', width: 150 },
      ],
      rows,
    });
  } catch (error) {
    console.error('ERROR PDF REPORTE ATENCIONES:', error);

    res.status(500).json({
      ok: false,
      message: 'Error al generar PDF de atenciones.',
      error: error.message,
    });
  }
}

async function exportReportePagosPdf(req, res) {
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
            { model: Cliente, as: 'cliente' },
            { model: Empleado, as: 'empleado' },
          ],
        },
      ],
      order: [['fecha', 'DESC']],
    });

    const rows = pagos.map((pago) => ({
      id: pago.id_pago,
      fecha: formatDate(pago.fecha),
      venta: pago.id_venta,
      cliente: fullName(pago.venta?.cliente),
      empleado: fullName(pago.venta?.empleado),
      metodo: pago.metodoPago?.nombre || '-',
      monto: formatMoney(pago.monto),
      estado: pago.estado,
      referencia: pago.referencia_externa || '-',
    }));

    const totalPagos = pagos.reduce((acc, item) => acc + Number(item.monto || 0), 0);

    streamReportPdf(res, 'reporte-pagos.pdf', {
      title: 'Reporte de Pagos',
      subtitle: estado_pago
        ? `Estado filtrado: ${estado_pago}`
        : buildSubtitle(fecha_inicio, fecha_fin),
      summary: [
        { label: 'Total registros', value: pagos.length },
        { label: 'Total pagos', value: formatMoney(totalPagos) },
      ],
      columns: [
        { key: 'id', label: 'ID Pago', width: 45 },
        { key: 'fecha', label: 'Fecha', width: 95 },
        { key: 'venta', label: 'Venta', width: 50 },
        { key: 'cliente', label: 'Cliente', width: 125 },
        { key: 'empleado', label: 'Empleado', width: 115 },
        { key: 'metodo', label: 'Método', width: 90 },
        { key: 'monto', label: 'Monto', width: 70 },
        { key: 'estado', label: 'Estado', width: 70 },
        { key: 'referencia', label: 'Referencia', width: 105 },
      ],
      rows,
    });
  } catch (error) {
    console.error('ERROR PDF REPORTE PAGOS:', error);

    res.status(500).json({
      ok: false,
      message: 'Error al generar PDF de pagos.',
      error: error.message,
    });
  }
}

module.exports = {
  exportReporteVentasPdf,
  exportReporteComprasPdf,
  exportReporteStockPdf,
  exportReporteAtencionesPdf,
  exportReportePagosPdf,
};