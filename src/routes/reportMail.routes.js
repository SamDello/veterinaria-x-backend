const express = require('express');
const router = express.Router();

const {
  sendVentasReportMail,
  sendComprasReportMail,
  sendStockReportMail,
  sendAtencionesReportMail,
  sendPagosReportMail,
} = require('../controllers/reportMail.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const { sendReportMailValidator } = require('../validators/reportMail.validator');

router.use(authenticateJWT);
router.use(authorizePermissions('CONSULTAR_REPORTES_OPERATIVOS'));

router.post('/ventas', sendReportMailValidator, validateFields, sendVentasReportMail);
router.post('/compras', sendReportMailValidator, validateFields, sendComprasReportMail);
router.post('/stock', sendReportMailValidator, validateFields, sendStockReportMail);
router.post('/atenciones', sendReportMailValidator, validateFields, sendAtencionesReportMail);
router.post('/pagos', sendReportMailValidator, validateFields, sendPagosReportMail);

module.exports = router;