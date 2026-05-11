const express = require('express');
const router = express.Router();

const {
  createProveedor,
  getProveedores,
  getProveedorById,
  updateProveedor,
  deleteProveedor,
  changeProveedorStatus,
} = require('../controllers/proveedor.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const {
  createProveedorValidator,
  updateProveedorValidator,
} = require('../validators/proveedor.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('GESTIONAR_PROVEEDORES'),
  createProveedorValidator,
  validateFields,
  createProveedor
);

router.get(
  '/',
  authorizePermissions('GESTIONAR_PROVEEDORES'),
  getProveedores
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_PROVEEDORES'),
  getProveedorById
);

router.put(
  '/:id',
  authorizePermissions('GESTIONAR_PROVEEDORES'),
  updateProveedorValidator,
  validateFields,
  updateProveedor
);

router.delete(
  '/:id',
  authorizePermissions('GESTIONAR_PROVEEDORES'),
  deleteProveedor
);

router.patch(
  '/:id/estado',
  authorizePermissions('GESTIONAR_PROVEEDORES'),
  changeProveedorStatus
);

module.exports = router;