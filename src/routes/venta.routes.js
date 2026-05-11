const express = require('express');
const router = express.Router();

const {
  createVentaProductos,
  createVentaServicios,
  getMascotasByCliente,
  getAtencionesPendientesByMascota,
  getStockAlmacenesByProducto,
  getVentas,
} = require('../controllers/venta.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const {
  authorizePermissions,
  authorizeAnyPermission,
} = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const { createVentaValidator } = require('../validators/venta.validator');

router.use(authenticateJWT);

router.post(
  '/productos',
  authorizePermissions('REGISTRAR_VENTAS_PRODUCTOS'),
  createVentaValidator,
  validateFields,
  createVentaProductos
);

router.post(
  '/servicios',
  authorizePermissions('REGISTRAR_VENTAS_SERVICIOS'),
  createVentaValidator,
  validateFields,
  createVentaServicios
);

router.get(
  '/productos/:id_producto/stock-almacenes',
  authorizePermissions('REGISTRAR_VENTAS_PRODUCTOS'),
  getStockAlmacenesByProducto
);

router.get(
  '/cliente/:id_cliente/mascotas',
  authorizePermissions('REGISTRAR_VENTAS_SERVICIOS'),
  getMascotasByCliente
);

router.get(
  '/mascota/:id_mascota/atenciones-pendientes',
  authorizePermissions('REGISTRAR_VENTAS_SERVICIOS'),
  getAtencionesPendientesByMascota
);

router.get(
  '/',
  authorizeAnyPermission('REGISTRAR_VENTAS_PRODUCTOS', 'REGISTRAR_VENTAS_SERVICIOS'),
  getVentas
);

module.exports = router;