const express = require('express');
const router = express.Router();

const {
  createPago,
  getPagos,
  getPagoById,
  getPagosByVenta,
  pagarVentaEfectivo,
  anularPagoVenta,
} = require('../controllers/pago.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const {
  createPagoValidator,
} = require('../validators/pago.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('GESTIONAR_PAGOS'),
  createPagoValidator,
  validateFields,
  createPago
);

router.get(
  '/',
  authorizePermissions('GESTIONAR_PAGOS'),
  getPagos
);

router.post(
  '/venta/:id_venta/efectivo',
  authorizePermissions('GESTIONAR_PAGOS'),
  pagarVentaEfectivo
);

router.post(
  '/venta/:id_venta/anular',
  authorizePermissions('GESTIONAR_PAGOS'),
  anularPagoVenta
);

router.get(
  '/venta/:id_venta',
  authorizePermissions('GESTIONAR_PAGOS'),
  getPagosByVenta
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_PAGOS'),
  getPagoById
);

module.exports = router;