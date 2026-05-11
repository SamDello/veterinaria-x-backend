const express = require('express');
const router = express.Router();

const {
  createProducto,
  getProductos,
  getProductoById,
  updateProducto,
  deleteProducto,
  changeProductoStatus,
} = require('../controllers/producto.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const {
  createProductoValidator,
  updateProductoValidator,
} = require('../validators/producto.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('GESTIONAR_PRODUCTOS'),
  createProductoValidator,
  validateFields,
  createProducto
);

router.get(
  '/',
  authorizePermissions('GESTIONAR_PRODUCTOS'),
  getProductos
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_PRODUCTOS'),
  getProductoById
);

router.put(
  '/:id',
  authorizePermissions('GESTIONAR_PRODUCTOS'),
  updateProductoValidator,
  validateFields,
  updateProducto
);

router.delete(
  '/:id',
  authorizePermissions('GESTIONAR_PRODUCTOS'),
  deleteProducto
);

router.patch(
  '/:id/estado',
  authorizePermissions('GESTIONAR_PRODUCTOS'),
  changeProductoStatus
);

module.exports = router;