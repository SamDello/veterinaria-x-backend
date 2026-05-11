const {
  MovimientoCaja,
  AperturaCaja,
  Caja,
  Empleado,
  MetodoPago,
  Pago,
  Venta,
  Cliente,
} = require('../models');

async function getMovimientosCaja(req, res) {
  try {
    const movimientos = await MovimientoCaja.findAll({
      include: [
        {
          model: AperturaCaja,
          as: 'aperturaCaja',
          include: [
            {
              model: Caja,
              as: 'caja',
            },
            {
              model: Empleado,
              as: 'empleado',
            },
          ],
        },
        {
          model: Empleado,
          as: 'empleado',
        },
        {
          model: MetodoPago,
          as: 'metodoPago',
        },
        {
          model: Pago,
          as: 'pago',
          include: [
            {
              model: Venta,
              as: 'venta',
              include: [
                {
                  model: Cliente,
                  as: 'cliente',
                },
              ],
            },
          ],
        },
      ],
      order: [['id_movimiento_caja', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: movimientos,
    });
  } catch (error) {
    console.error('ERROR GET MOVIMIENTOS CAJA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar movimientos de caja.',
      error: error.message,
    });
  }
}

async function getMovimientoCajaById(req, res) {
  try {
    const { id } = req.params;

    const movimiento = await MovimientoCaja.findByPk(id, {
      include: [
        {
          model: AperturaCaja,
          as: 'aperturaCaja',
          include: [
            {
              model: Caja,
              as: 'caja',
            },
            {
              model: Empleado,
              as: 'empleado',
            },
          ],
        },
        {
          model: Empleado,
          as: 'empleado',
        },
        {
          model: MetodoPago,
          as: 'metodoPago',
        },
        {
          model: Pago,
          as: 'pago',
          include: [
            {
              model: Venta,
              as: 'venta',
              include: [
                {
                  model: Cliente,
                  as: 'cliente',
                },
              ],
            },
          ],
        },
      ],
    });

    if (!movimiento) {
      return res.status(404).json({
        ok: false,
        message: 'Movimiento de caja no encontrado.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: movimiento,
    });
  } catch (error) {
    console.error('ERROR GET MOVIMIENTO CAJA BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener movimiento de caja.',
      error: error.message,
    });
  }
}

module.exports = {
  getMovimientosCaja,
  getMovimientoCajaById,
};