const express = require('express');
const router = express.Router();

const {
  createCompra,
  getCompras,
  getCompraById,
} = require('../controllers/compra.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const {
  createCompraValidator,
} = require('../validators/compra.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('REGISTRAR_COMPRAS'),
  createCompraValidator,
  validateFields,
  createCompra
);

router.get(
  '/',
  authorizePermissions('REGISTRAR_COMPRAS'),
  getCompras
);

router.get(
  '/:id',
  authorizePermissions('REGISTRAR_COMPRAS'),
  getCompraById
);

module.exports = router;