const express = require('express');
const router = express.Router();

const {
  createAperturaCaja,
  getAperturasCaja,
  getAperturaCajaById,
} = require('../controllers/aperturaCaja.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const {
  createAperturaCajaValidator,
} = require('../validators/aperturaCaja.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('REGISTRAR_APERTURA_CAJA'),
  createAperturaCajaValidator,
  validateFields,
  createAperturaCaja
);

router.get(
  '/',
  authorizePermissions('REGISTRAR_APERTURA_CAJA'),
  getAperturasCaja
);

router.get(
  '/:id',
  authorizePermissions('REGISTRAR_APERTURA_CAJA'),
  getAperturaCajaById
);

module.exports = router;