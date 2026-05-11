const express = require('express');
const router = express.Router();

const {
  createCaja,
  getCajas,
  getCajaById,
  updateCaja,
  changeCajaStatus,
} = require('../controllers/caja.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const {
  createCajaValidator,
} = require('../validators/caja.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('GESTIONAR_CAJA'),
  createCajaValidator,
  validateFields,
  createCaja
);

router.get(
  '/',
  authorizePermissions('GESTIONAR_CAJA'),
  getCajas
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_CAJA'),
  getCajaById
);

router.put(
  '/:id',
  authorizePermissions('GESTIONAR_CAJA'),
  createCajaValidator,
  validateFields,
  updateCaja
);

router.patch(
  '/:id/estado',
  authorizePermissions('GESTIONAR_CAJA'),
  changeCajaStatus
);

module.exports = router;