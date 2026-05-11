const express = require('express');
const router = express.Router();

const {
  exportReporteVentasPdf,
  exportReporteComprasPdf,
  exportReporteStockPdf,
  exportReporteAtencionesPdf,
  exportReportePagosPdf,
} = require('../controllers/reportePdf.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');

router.use(authenticateJWT);
router.use(authorizePermissions('CONSULTAR_REPORTES_OPERATIVOS'));

router.get('/ventas', exportReporteVentasPdf);
router.get('/compras', exportReporteComprasPdf);
router.get('/stock', exportReporteStockPdf);
router.get('/atenciones', exportReporteAtencionesPdf);
router.get('/pagos', exportReportePagosPdf);

module.exports = router;