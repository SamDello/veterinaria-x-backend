const express = require('express');
const router = express.Router();

const {
  createAlmacen,
  getAlmacenes,
  getAlmacenById,
  updateAlmacen,
  changeAlmacenStatus,
} = require('../controllers/almacen.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const { createAlmacenValidator } = require('../validators/almacen.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('GESTIONAR_ALMACENES'),
  createAlmacenValidator,
  validateFields,
  createAlmacen
);

router.get(
  '/',
  authorizePermissions('GESTIONAR_ALMACENES'),
  getAlmacenes
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_ALMACENES'),
  getAlmacenById
);

router.put(
  '/:id',
  authorizePermissions('GESTIONAR_ALMACENES'),
  createAlmacenValidator,
  validateFields,
  updateAlmacen
);

router.patch(
  '/:id/estado',
  authorizePermissions('GESTIONAR_ALMACENES'),
  changeAlmacenStatus
);

module.exports = router;