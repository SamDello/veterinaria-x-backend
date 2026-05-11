const express = require('express');
const router = express.Router();

const {
  generarQrVenta,
  consultarEstadoQrVenta,
  callbackLibelula,
  obtenerEstadoQrLocalVenta,
} = require('../controllers/pagoQr.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');

router.post(
  '/ventas/:id_venta/generar',
  authenticateJWT,
  authorizePermissions('GESTIONAR_PAGOS'),
  generarQrVenta
);

router.get(
  '/ventas/:id_venta/estado',
  authenticateJWT,
  authorizePermissions('GESTIONAR_PAGOS'),
  consultarEstadoQrVenta
);

router.get(
  '/ventas/:id_venta/local-estado',
  authenticateJWT,
  authorizePermissions('GESTIONAR_PAGOS'),
  obtenerEstadoQrLocalVenta
);

router.get(
  '/libelula/callback',
  callbackLibelula
);

router.post(
  '/libelula/callback',
  callbackLibelula
);



module.exports = router;