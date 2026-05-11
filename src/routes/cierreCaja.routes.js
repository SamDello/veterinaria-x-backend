const express = require('express');
const router = express.Router();

const {
  createCierreCaja,
  getCierresCaja,
  getCierreCajaById,
} = require('../controllers/cierreCaja.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const {
  createCierreCajaValidator,
} = require('../validators/cierreCaja.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('REGISTRAR_CIERRE_CAJA'),
  createCierreCajaValidator,
  validateFields,
  createCierreCaja
);

router.get(
  '/',
  authorizePermissions('REGISTRAR_CIERRE_CAJA'),
  getCierresCaja
);

router.get(
  '/:id',
  authorizePermissions('REGISTRAR_CIERRE_CAJA'),
  getCierreCajaById
);

module.exports = router;