const express = require('express');
const router = express.Router();

const {
  createMetodoPago,
  getMetodosPago,
  getMetodoPagoById,
  updateMetodoPago,
  changeMetodoPagoStatus,
} = require('../controllers/metodoPago.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const {
  createMetodoPagoValidator,
} = require('../validators/metodoPago.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('GESTIONAR_METODOS_PAGO'),
  createMetodoPagoValidator,
  validateFields,
  createMetodoPago
);

router.get(
  '/',
  authorizePermissions('GESTIONAR_METODOS_PAGO'),
  getMetodosPago
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_METODOS_PAGO'),
  getMetodoPagoById
);

router.put(
  '/:id',
  authorizePermissions('GESTIONAR_METODOS_PAGO'),
  createMetodoPagoValidator,
  validateFields,
  updateMetodoPago
);

router.patch(
  '/:id/estado',
  authorizePermissions('GESTIONAR_METODOS_PAGO'),
  changeMetodoPagoStatus
);

module.exports = router;