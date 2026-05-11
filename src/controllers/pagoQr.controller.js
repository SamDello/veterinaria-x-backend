const {
  Venta,
  Cliente,
  Pago,
  MetodoPago,
  PagoQrLibelula,
  sequelize,
} = require('../models');

const {
  registrarDeudaLibelula,
  consultarDeudaLibelula,
} = require('../services/libelula.service');

function generarIdentificadorDeuda(idVenta) {
  const timestamp = Date.now();
  return `VENTA-${idVenta}-${timestamp}`;
}

async function generarQrVenta(req, res) {
  const transaction = await sequelize.transaction();

  try {
    const { id_venta } = req.params;

    const venta = await Venta.findByPk(id_venta, {
      include: [
        {
          model: Cliente,
          as: 'cliente',
        },
      ],
      transaction,
    });

    if (!venta) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        message: 'Venta no encontrada.',
      });
    }

    const metodoPagoQr = await MetodoPago.findOne({
      where: { nombre: 'QR_LIBELULA' },
      transaction,
    });

    if (!metodoPagoQr) {
      await transaction.rollback();
      return res.status(404).json({
        ok: false,
        message: 'No existe el metodo de pago QR_LIBELULA.',
      });
    }

    const pagoExistente = await Pago.findOne({
      where: {
        id_venta: venta.id_venta,
        id_metodo_pago: metodoPagoQr.id_metodo_pago,
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

    if (
      pagoExistente &&
      pagoExistente.pagoQrLibelula &&
      pagoExistente.pagoQrLibelula.estado_libelula === 'GENERADO'
    ) {
      await transaction.commit();
      return res.status(200).json({
        ok: true,
        message: 'La venta ya tiene un QR pendiente generado.',
        data: {
          pago: pagoExistente,
          pago_qr_libelula: pagoExistente.pagoQrLibelula,
        },
      });
    }

    const identificadorDeuda = generarIdentificadorDeuda(venta.id_venta);

    const clienteNombre = venta.cliente?.nombre || 'Cliente';
    const clienteApellido = venta.cliente?.apellidos || '';
    const clienteCorreo = venta.cliente?.correo || '';
    const clienteDocumento = venta.cliente?.ci_nit || '';

    const payloadLibelula = {
        identificador_deuda: identificadorDeuda,
        email_cliente: clienteCorreo,
        nombre_cliente: clienteNombre,
        apellido_cliente: clienteApellido,
        descripcion: `Pago de venta #${venta.id_venta}`,
        callback_url: process.env.LIBELULA_CALLBACK_URL,
        moneda: process.env.LIBELULA_MONEDA || 'BOB',

        // si tu integración requiere datos de documento/factura
        numero_documento: clienteDocumento || '0',
        codigo_tipo_documento: 'CI',

        lineas_detalle_deuda: [
            {
            descripcion: `Venta #${venta.id_venta}`,
            cantidad: 1,
            costo_unitario: Number(venta.total),
            subtotal: Number(venta.total)
            }
        ]
    };
    const respuestaLibelula = await registrarDeudaLibelula(payloadLibelula);

    const errorLibelula = Number(respuestaLibelula?.error || 0);
    const mensajeLibelula =
      respuestaLibelula?.mensaje || 'Libelula devolvio una respuesta invalida.';

    if (errorLibelula === 1) {
      await transaction.rollback();
      return res.status(400).json({
        ok: false,
        message: 'Libelula rechazo la generacion del QR.',
        detail: respuestaLibelula,
      });
    }

    const paymentUrl =
  respuestaLibelula?.url_pasarela_pagos || null;

    const qrUrl =
    respuestaLibelula?.qr_simple_url || null;

    const qrBase64 = null;

    if (!paymentUrl && !qrUrl && !qrBase64) {
      await transaction.rollback();
      return res.status(400).json({
        ok: false,
        message: 'Libelula no devolvio ni link ni imagen QR.',
        detail: respuestaLibelula,
      });
    }

    const pago = await Pago.create(
      {
        id_venta: venta.id_venta,
        id_metodo_pago: metodoPagoQr.id_metodo_pago,
        monto: Number(venta.total),
        estado: 'PENDIENTE',
        observacion: `Pago QR Libelula para venta #${venta.id_venta}`,
        referencia_externa:
        respuestaLibelula?.id_transaccion || identificadorDeuda,
      },
      { transaction }
    );

    const pagoQr = await PagoQrLibelula.create(
      {
        id_pago: pago.id_pago,
        id_venta: venta.id_venta,
        identificador_deuda: identificadorDeuda,
        codigo_transaccion_libelula:
        respuestaLibelula?.id_transaccion || null,
        appkey: process.env.LIBELULA_APPKEY || null,
        payment_url: paymentUrl,
        qr_url: qrUrl,
        qr_base64: qrBase64,
        estado_libelula: 'GENERADO',
        monto_solicitado: Number(venta.total),
        moneda: process.env.LIBELULA_MONEDA || 'BOB',
        fecha_expiracion: respuestaLibelula?.fecha_expiracion || null,
        respuesta_creacion: respuestaLibelula,
        observacion: mensajeLibelula,
      },
      { transaction }
    );

    await transaction.commit();

    return res.status(201).json({
      ok: true,
      message: 'QR generado correctamente con Libelula.',
      data: {
        pago,
        pago_qr_libelula: pagoQr,
      },
    });
  } catch (error) {
    await transaction.rollback();

    console.error('ERROR GENERAR QR VENTA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al generar QR para la venta.',
      error: error.message || error,
      detail: error.detail || null,
    });
  }
}

async function consultarEstadoQrVenta(req, res) {
  try {
    const { id_venta } = req.params;

    const pagoQr = await PagoQrLibelula.findOne({
      where: { id_venta },
      include: [
        {
          model: Pago,
          as: 'pago',
        },
        {
          model: Venta,
          as: 'venta',
        },
      ],
      order: [['id_pago_qr_libelula', 'DESC']],
    });

    if (!pagoQr) {
      return res.status(404).json({
        ok: false,
        message: 'No existe integracion QR Libelula para esta venta.',
      });
    }

    const respuestaConsulta = await consultarDeudaLibelula({
      identificador_deuda: pagoQr.identificador_deuda,
    });

    let nuevoEstadoLibelula = pagoQr.estado_libelula;
    let nuevoEstadoPago = pagoQr.pago?.estado || 'PENDIENTE';
    let fechaConfirmacion = pagoQr.pago?.fecha_confirmacion || null;

    const estadoExterno =
      respuestaConsulta?.estado ||
      respuestaConsulta?.estado_deuda ||
      respuestaConsulta?.status ||
      '';

    const estadoNormalizado = String(estadoExterno).toUpperCase();

    if (estadoNormalizado.includes('PAGADO')) {
      nuevoEstadoLibelula = 'PAGADO';
      nuevoEstadoPago = 'PAGADO';
      fechaConfirmacion = new Date();
    } else if (estadoNormalizado.includes('VENCIDO')) {
      nuevoEstadoLibelula = 'VENCIDO';
      nuevoEstadoPago = 'EXPIRADO';
    } else if (estadoNormalizado.includes('ANULADO')) {
      nuevoEstadoLibelula = 'ANULADO';
      nuevoEstadoPago = 'ANULADO';
    }

    await pagoQr.update({
      estado_libelula: nuevoEstadoLibelula,
      respuesta_consulta: respuestaConsulta,
      updated_at: new Date(),
    });

    if (pagoQr.pago) {
      await pagoQr.pago.update({
        estado: nuevoEstadoPago,
        fecha_confirmacion: fechaConfirmacion,
        updated_at: new Date(),
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Estado del QR consultado correctamente.',
      data: {
        pago_qr_libelula: pagoQr,
        respuesta_libelula: respuestaConsulta,
      },
    });
  } catch (error) {
    console.error('ERROR CONSULTAR ESTADO QR VENTA:', error);
    return res.status(500).json({
      ok: false,
      message: 'Error al consultar estado QR de la venta.',
      error: error.message || error,
      detail: error.detail || null,
    });
  }
}

async function callbackLibelula(req, res) {
  try {
    const payload = {
      ...(req.query || {}),
      ...(req.body || {}),
    };

    console.log('CALLBACK LIBELULA RECIBIDO:', payload);

    const identificadorDeuda =
      payload?.identificador_deuda ||
      payload?.identificadorDeuda ||
      payload?.IdentificadorDeuda ||
      payload?.deuda ||
      payload?.id_deuda ||
      payload?.transaction_id ||
      payload?.id_transaccion ||
      payload?.codigo_transaccion_libelula ||
      null;

    if (!identificadorDeuda) {
      return res.status(400).json({
        ok: false,
        message: 'Callback sin identificador de deuda o transaction_id.',
        payload,
      });
    }

    const pagoQr = await PagoQrLibelula.findOne({
      where: { identificador_deuda: identificadorDeuda },
      include: [
        {
          model: Pago,
          as: 'pago',
        },
      ],
    });

    if (!pagoQr) {
      return res.status(404).json({
        ok: false,
        message: 'No existe pago QR Libelula para ese identificador.',
        identificador_deuda: identificadorDeuda,
        payload,
      });
    }

    const estadoExterno =
      payload?.estado ||
      payload?.estado_deuda ||
      payload?.status ||
      payload?.message ||
      payload?.mensaje ||
      '';

    const estadoNormalizado = String(estadoExterno).toUpperCase();

    const errorLibelula = String(payload?.error ?? '').trim();
    const cancelOrder = String(payload?.cancel_order ?? '').trim();
    const numeroReferencia = payload?.numeroReferencia || payload?.numero_referencia || null;
    const paymentMethod = payload?.payment_method || null;

    const pagoConfirmadoPorGet =
      errorLibelula === '0' &&
      cancelOrder !== '1' &&
      (
        estadoNormalizado.includes('OK') ||
        estadoNormalizado.includes('PAGADO') ||
        numeroReferencia ||
        paymentMethod
      );

    let nuevoEstadoLibelula = pagoQr.estado_libelula;
    let nuevoEstadoPago = pagoQr.pago?.estado || 'PENDIENTE';
    let fechaConfirmacion = pagoQr.pago?.fecha_confirmacion || null;

    if (estadoNormalizado.includes('PAGADO') || pagoConfirmadoPorGet) {
      nuevoEstadoLibelula = 'PAGADO';
      nuevoEstadoPago = 'PAGADO';
      fechaConfirmacion = new Date();
    } else if (estadoNormalizado.includes('VENCIDO')) {
      nuevoEstadoLibelula = 'VENCIDO';
      nuevoEstadoPago = 'EXPIRADO';
    } else if (
      estadoNormalizado.includes('ANULADO') ||
      estadoNormalizado.includes('CANCELADO') ||
      cancelOrder === '1'
    ) {
      nuevoEstadoLibelula = 'ANULADO';
      nuevoEstadoPago = 'ANULADO';
    }

    await pagoQr.update({
      estado_libelula: nuevoEstadoLibelula,
      codigo_transaccion_libelula:
        numeroReferencia ||
        payload?.codigo_transaccion_libelula ||
        payload?.id_transaccion ||
        pagoQr.codigo_transaccion_libelula,
      respuesta_callback: payload,
      observacion: `Callback Libelula procesado. Estado: ${nuevoEstadoLibelula}`,
      updated_at: new Date(),
    });

    if (pagoQr.pago) {
      await pagoQr.pago.update({
        estado: nuevoEstadoPago,
        referencia_externa:
          numeroReferencia ||
          payload?.transaction_id ||
          pagoQr.pago.referencia_externa,
        fecha_confirmacion: fechaConfirmacion,
        updated_at: new Date(),
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Callback procesado correctamente.',
      data: {
        identificador_deuda: identificadorDeuda,
        estado_pago: nuevoEstadoPago,
        estado_libelula: nuevoEstadoLibelula,
      },
    });
  } catch (error) {
    console.error('ERROR CALLBACK LIBELULA:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al procesar callback de Libelula.',
      error: error.message || error,
    });
  }
}

async function obtenerEstadoQrLocalVenta(req, res) {
  try {
    const { id_venta } = req.params;

    const pagoQr = await PagoQrLibelula.findOne({
      where: { id_venta },
      include: [
        {
          model: Pago,
          as: 'pago',
        },
      ],
      order: [['id_pago_qr_libelula', 'DESC']],
    });

    if (!pagoQr) {
      return res.status(404).json({
        ok: false,
        message: 'No existe QR Libelula para esta venta.',
      });
    }

    return res.status(200).json({
      ok: true,
      message: 'Estado local del QR obtenido correctamente.',
      data: {
        id_venta: Number(id_venta),
        estado_libelula: pagoQr.estado_libelula,
        estado_pago: pagoQr.pago?.estado || 'PENDIENTE',
        pago_qr_libelula: pagoQr,
        pago: pagoQr.pago,
      },
    });
  } catch (error) {
    console.error('ERROR OBTENER ESTADO LOCAL QR:', error);

    return res.status(500).json({
      ok: false,
      message: 'Error al obtener estado local del QR.',
      error: error.message || error,
    });
  }
}

module.exports = {
  generarQrVenta,
  consultarEstadoQrVenta,
  callbackLibelula,
  obtenerEstadoQrLocalVenta,
};