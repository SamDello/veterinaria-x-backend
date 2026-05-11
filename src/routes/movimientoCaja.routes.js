const express = require('express');
const router = express.Router();

const {
  getMovimientosCaja,
  getMovimientoCajaById,
} = require('../controllers/movimientoCaja.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');

router.use(authenticateJWT);

router.get(
  '/',
  authorizePermissions('GESTIONAR_MOVIMIENTOS_CAJA'),
  getMovimientosCaja
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_MOVIMIENTOS_CAJA'),
  getMovimientoCajaById
);

module.exports = router;