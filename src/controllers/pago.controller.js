const {
  Pago,
  Venta,
  Cliente,
  Empleado,
  MetodoPago,
  AperturaCaja,
  MovimientoCaja,
  PagoQrLibelula,
  sequelize,
} = require('../models');

async function createPago(req, res) {
  try {
    const {
      id_venta,
      id_metodo_pago,
      monto,
      estado,
      observacion,
      id_apertura_caja,
      id_empleado,
    } = req.body;

    const venta = await Venta.findByPk(id_venta);
    if (!venta) {
      return res.status(404).json({
        ok: false,
        message: 'Venta no encontrada.',
      });
    }

    const metodoPago = await MetodoPago.findByPk(id_metodo_pago);
    if (!metodoPago) {
      return res.status(404).json({
        ok: false,
        message: 'Metodo de pago no encontrado.',
      });
    }

    const pago = await Pago.create({
      id_venta,
      id_metodo_pago,
      monto,
      estado: estado || 'PAGADO',
      observacion: observacion || null,
    });

    if (id_apertura_caja && id_empleado && pago.estado === 'PAGADO') {
      const aperturaCaja = await AperturaCaja.findByPk(id_apertura_caja);

      if (!aperturaCaja) {
        return res.status(404).json({
          ok: false,
          message: 'Apertura de caja no encontrada.',
        });
      }

      if (aperturaCaja.estado !== 'ABIERTA') {
        return res.status(400).json({
          ok: false,
          message: 'La caja indicada no se encuentra abierta.',
        });
      }

      await MovimientoCaja.create({
        id_apertura_caja,
        id_empleado,
        id_metodo_pago,
        id_pago: pago.id_pago,
        tipo_movimiento: 'INGRESO',
        monto,
        observacion: 'Ingreso por pago de venta',
        referencia_tipo: 'PAGO',
        referencia_id: pago.id_pago,
      });
    }

    return res.status(201).json({
      ok: true,
      message: 'Pago registrado correctamente.',
      data: pago,
    });
  } catch (error) {
    console.error('ERROR CREATE PAGO:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al registrar pago.',
      error: error.message,
    });
  }
}

async function getPagos(req, res) {
  try {
    const pagos = await Pago.findAll({
      include: [
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
        {
          model: MetodoPago,
          as: 'metodoPago',
        },
        {
          model: PagoQrLibelula,
          as: 'pagoQrLibelula',
        },
      ],
      order: [['id_pago', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: pagos,
    });
  } catch (error) {
    console.error('ERROR GET PAGOS:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar pagos.',
      error: error.message,
    });
  }
}

async function getPagoById(req, res) {
  try {
    const { id } = req.params;

    const pago = await Pago.findByPk(id, {
      include: [
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
        {
          model: MetodoPago,
          as: 'metodoPago',
        },
        {
          model: PagoQrLibelula,
          as: 'pagoQrLibelula',
        },
      ],
    });

    if (!pago) {
      return res.status(404).json({
        ok: false,
        message: 'Pago no encontrado.',
      });
    }

    return res.status(200).json({
      ok: true,
      data: pago,
    });
  } catch (error) {
    console.error('ERROR GET PAGO BY ID:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al obtener el pago.',
      error: error.message,
    });
  }
}

async function getPagosByVenta(req, res) {
  try {
    const { id_venta } = req.params;

    const pagos = await Pago.findAll({
      where: { id_venta },
      include: [
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
        {
          model: MetodoPago,
          as: 'metodoPago',
        },
        {
          model: PagoQrLibelula,
          as: 'pagoQrLibelula',
        },
      ],
      order: [['id_pago', 'DESC']],
    });

    return res.status(200).json({
      ok: true,
      data: pagos,
    });
  } catch (error) {
    console.error('ERROR GET PAGOS BY VENTA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al listar pagos de la venta.',
      error: error.message,
    });
  }
}

async function pagarVentaEfectivo(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const { id_venta } = req.params;

    const venta = await Venta.findByPk(id_venta, { transaction });

    if (!venta) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        message: 'Venta no encontrada.',
      });
    }

    const pagoPagado = await Pago.findOne({
      where: {
        id_venta: venta.id_venta,
        estado: 'PAGADO',
      },
      transaction,
    });

    if (pagoPagado) {
      await transaction.rollback();
      return res.status(400).json({
        ok: false,
        message: 'Esta venta ya tiene un pago registrado como PAGADO.',
      });
    }

    const metodoEfectivo = await MetodoPago.findOne({
      where: { nombre: 'EFECTIVO' },
      transaction,
    });

    if (!metodoEfectivo) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        message: 'No existe el método de pago EFECTIVO.',
      });
    }

    const pagosPendientes = await Pago.findAll({
      where: {
        id_venta: venta.id_venta,
        estado: 'PENDIENTE',
      },
      include: [
        {
          model: PagoQrLibelula,
          as: 'pagoQrLibelula',
        },
      ],
      transaction,
    });

    for (const pagoPendiente of pagosPendientes) {
      await pagoPendiente.update(
        {
          estado: 'ANULADO',
          observacion: 'Pago pendiente anulado por registro de pago en efectivo.',
          updated_at: new Date(),
        },
        { transaction }
      );

      if (pagoPendiente.pagoQrLibelula) {
        await pagoPendiente.pagoQrLibelula.update(
          {
            estado_libelula: 'ANULADO',
            observacion: 'QR anulado porque la venta fue pagada en efectivo.',
            updated_at: new Date(),
          },
          { transaction }
        );
      }
    }

    const pago = await Pago.create(
      {
        id_venta: venta.id_venta,
        id_metodo_pago: metodoEfectivo.id_metodo_pago,
        monto: Number(venta.total),
        estado: 'PAGADO',
        observacion: `Pago en efectivo de venta #${venta.id_venta}`,
        referencia_externa: `EFECTIVO-${venta.id_venta}-${Date.now()}`,
        fecha_confirmacion: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      ok: true,
      message: 'Pago en efectivo registrado correctamente.',
      data: pago,
    });
  } catch (error) {
    await transaction.rollback();

    console.error('ERROR PAGAR VENTA EFECTIVO:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al registrar pago en efectivo.',
      error: error.message,
    });
  }
}

async function anularPagoVenta(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const { id_venta } = req.params;

    const venta = await Venta.findByPk(id_venta, { transaction });

    if (!venta) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        message: 'Venta no encontrada.',
      });
    }

    const pagoPagado = await Pago.findOne({
      where: {
        id_venta: venta.id_venta,
        estado: 'PAGADO',
      },
      transaction,
    });

    if (pagoPagado) {
      await transaction.rollback();
      return res.status(400).json({
        ok: false,
        message: 'No se puede anular porque la venta ya tiene un pago PAGADO.',
      });
    }

    const pagosPendientes = await Pago.findAll({
      where: {
        id_venta: venta.id_venta,
        estado: 'PENDIENTE',
      },
      include: [
        {
          model: PagoQrLibelula,
          as: 'pagoQrLibelula',
        },
      ],
      transaction,
    });

    if (pagosPendientes.length > 0) {
      for (const pagoPendiente of pagosPendientes) {
        await pagoPendiente.update(
          {
            estado: 'ANULADO',
            observacion: 'Pago anulado desde el módulo de ventas.',
            updated_at: new Date(),
          },
          { transaction }
        );

        if (pagoPendiente.pagoQrLibelula) {
          await pagoPendiente.pagoQrLibelula.update(
            {
              estado_libelula: 'ANULADO',
              observacion: 'QR anulado desde el módulo de ventas.',
              updated_at: new Date(),
            },
            { transaction }
          );
        }
      }

      await transaction.commit();

      return res.status(200).json({
        ok: true,
        message: 'Pago pendiente anulado correctamente.',
      });
    }

    const pagoAnuladoExistente = await Pago.findOne({
      where: {
        id_venta: venta.id_venta,
        estado: 'ANULADO',
      },
      order: [['id_pago', 'DESC']],
      transaction,
    });

    if (pagoAnuladoExistente) {
      await transaction.commit();

      return res.status(200).json({
        ok: true,
        message: 'La venta ya tiene un pago ANULADO.',
        data: pagoAnuladoExistente,
      });
    }

    const metodoEfectivo = await MetodoPago.findOne({
      where: { nombre: 'EFECTIVO' },
      transaction,
    });

    if (!metodoEfectivo) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        message: 'No existe el método de pago EFECTIVO.',
      });
    }

    const pagoAnulado = await Pago.create(
      {
        id_venta: venta.id_venta,
        id_metodo_pago: metodoEfectivo.id_metodo_pago,
        monto: Number(venta.total),
        estado: 'ANULADO',
        observacion: `Pago anulado de venta #${venta.id_venta}`,
        referencia_externa: `ANULADO-${venta.id_venta}-${Date.now()}`,
        fecha_confirmacion: null,
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      ok: true,
      message: 'Pago anulado correctamente.',
      data: pagoAnulado,
    });
  } catch (error) {
    await transaction.rollback();

    console.error('ERROR ANULAR PAGO VENTA:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al anular pago de la venta.',
      error: error.message,
    });
  }
}

module.exports = {
  createPago,
  getPagos,
  getPagoById,
  getPagosByVenta,
  pagarVentaEfectivo,
  anularPagoVenta,
};