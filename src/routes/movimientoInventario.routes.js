const express = require('express');
const router = express.Router();

const {
  createMovimientoInventario,
  getMovimientosInventario,
  getMovimientoInventarioById,
} = require('../controllers/movimientoInventario.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const {
  createMovimientoInventarioValidator,
} = require('../validators/movimientoInventario.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('GESTIONAR_MOVIMIENTOS_INVENTARIO'),
  createMovimientoInventarioValidator,
  validateFields,
  createMovimientoInventario
);

router.get(
  '/',
  authorizePermissions('GESTIONAR_MOVIMIENTOS_INVENTARIO'),
  getMovimientosInventario
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_MOVIMIENTOS_INVENTARIO'),
  getMovimientoInventarioById
);

module.exports = router;