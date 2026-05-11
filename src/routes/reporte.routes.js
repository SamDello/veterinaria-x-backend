const express = require('express');
const router = express.Router();

const {
  getReporteVentas,
  getReporteCompras,
  getReporteStock,
  getReporteAtenciones,
  getReportePagos,
} = require('../controllers/reporte.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');

router.use(authenticateJWT);
router.use(authorizePermissions('CONSULTAR_REPORTES_OPERATIVOS'));

router.get('/ventas', getReporteVentas);
router.get('/compras', getReporteCompras);
router.get('/stock', getReporteStock);
router.get('/atenciones', getReporteAtenciones);
router.get('/pagos', getReportePagos);

module.exports = router;