const express = require('express');
const router = express.Router();

const {
  createRaza,
  getRazas,
  getRazaById,
  updateRaza,
  deleteRaza,
  changeRazaStatus,
} = require('../controllers/raza.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const {
  createRazaValidator,
  updateRazaValidator,
} = require('../validators/raza.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('GESTIONAR_RAZAS'),
  createRazaValidator,
  validateFields,
  createRaza
);

router.get(
  '/',
  authorizePermissions('GESTIONAR_RAZAS'),
  getRazas
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_RAZAS'),
  getRazaById
);

router.put(
  '/:id',
  authorizePermissions('GESTIONAR_RAZAS'),
  updateRazaValidator,
  validateFields,
  updateRaza
);

router.patch(
  '/:id/estado',
  authorizePermissions('GESTIONAR_RAZAS'),
  changeRazaStatus
);

router.delete(
  '/:id',
  authorizePermissions('GESTIONAR_RAZAS'),
  deleteRaza
);

module.exports = router;