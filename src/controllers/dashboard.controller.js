const { Op } = require('sequelize');

const {
  Venta,
  Pago,
  Stock,
  Producto,
  Almacen,
  Cliente,
  Empleado,
  AtencionVeterinaria,
  Mascota,
  Traspaso,
  InventarioLoteMovimiento,
  InventarioLote
} = require('../models');

function startOfDay(date) {
  const value = new Date(date);
  value.setHours(0, 0, 0, 0);
  return value;
}

function endOfDay(date) {
  const value = new Date(date);
  value.setHours(23, 59, 59, 999);
  return value;
}

function startOfMonth(date) {
  const value = new Date(date.getFullYear(), date.getMonth(), 1);
  value.setHours(0, 0, 0, 0);
  return value;
}

function endOfMonth(date) {
  const value = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  value.setHours(23, 59, 59, 999);
  return value;
}

function formatDateLocal(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function sumTotal(items, field = 'total') {
  return items.reduce((acc, item) => acc + Number(item[field] || 0), 0);
}

async function getDashboardResumen(req, res) {
  try {
    const hoy = new Date();

    const inicioHoy = startOfDay(hoy);
    const finHoy = endOfDay(hoy);

    const inicioMes = startOfMonth(hoy);
    const finMes = endOfMonth(hoy);

    const inicioUltimos7Dias = startOfDay(new Date(hoy));
    inicioUltimos7Dias.setDate(inicioUltimos7Dias.getDate() - 6);

    const ventasHoy = await Venta.findAll({
      where: {
        fecha: {
          [Op.between]: [inicioHoy, finHoy]
        }
      }
    });

    const ventasMes = await Venta.findAll({
      where: {
        fecha: {
          [Op.between]: [inicioMes, finMes]
        }
      }
    });

    const ventasUltimos7Dias = await Venta.findAll({
      where: {
        fecha: {
          [Op.between]: [inicioUltimos7Dias, finHoy]
        }
      },
      order: [['fecha', 'ASC']]
    });

    const pagosPendientes = await Pago.count({
      where: {
        estado: 'PENDIENTE'
      }
    });

    const stocks = await Stock.findAll({
      include: [
        {
          model: Producto,
          as: 'producto'
        },
        {
          model: Almacen,
          as: 'almacen'
        }
      ],
      order: [['id_stock', 'DESC']]
    });

    const productosStockBajo = stocks
      .filter((item) => Number(item.stock_actual || 0) <= Number(item.stock_minimo || 0))
      .slice(0, 10);

    const atencionesPendientes = await AtencionVeterinaria.count({
      where: {
        estado: true,
        estado_cobro: 'PENDIENTE'
      }
    });

    let traspasosMes = 0;

    if (Traspaso) {
      traspasosMes = await Traspaso.count({
        where: {
          fecha: {
            [Op.between]: [inicioMes, finMes]
          },
          estado: 'REGISTRADO'
        }
      });
    }

    const ultimasVentas = await Venta.findAll({
      include: [
        {
          model: Cliente,
          as: 'cliente'
        },
        {
          model: Empleado,
          as: 'empleado'
        }
      ],
      order: [['id_venta', 'DESC']],
      limit: 5
    });

    let ultimosMovimientosFIFO = [];

    if (InventarioLoteMovimiento) {
      ultimosMovimientosFIFO = await InventarioLoteMovimiento.findAll({
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
        ],
        limit: 8
      });
    }

    const mapaVentas7Dias = {};

    for (let i = 0; i < 7; i++) {
      const fecha = new Date(inicioUltimos7Dias);
      fecha.setDate(inicioUltimos7Dias.getDate() + i);

      mapaVentas7Dias[formatDateLocal(fecha)] = 0;
    }

    ventasUltimos7Dias.forEach((venta) => {
      const fecha = formatDateLocal(new Date(venta.fecha));
      mapaVentas7Dias[fecha] = Number(mapaVentas7Dias[fecha] || 0) + Number(venta.total || 0);
    });

    const ventas_ultimos_7_dias = Object.keys(mapaVentas7Dias).map((fecha) => ({
      fecha,
      total: Number(mapaVentas7Dias[fecha].toFixed(2))
    }));

    return res.status(200).json({
      ok: true,
      data: {
        ventas_hoy: Number(sumTotal(ventasHoy).toFixed(2)),
        ventas_mes: Number(sumTotal(ventasMes).toFixed(2)),
        pagos_pendientes: pagosPendientes,
        productos_stock_bajo: productosStockBajo.length,
        atenciones_pendientes: atencionesPendientes,
        traspasos_mes: traspasosMes,
        ventas_ultimos_7_dias,
        detalle_stock_bajo: productosStockBajo,
        ultimas_ventas: ultimasVentas,
        ultimos_movimientos_fifo: ultimosMovimientosFIFO
      }
    });
  } catch (error) {
    console.error('ERROR DASHBOARD RESUMEN:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al generar resumen del dashboard.',
      error: error.message
    });
  }
}

module.exports = {
  getDashboardResumen
};