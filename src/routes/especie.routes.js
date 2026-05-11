const express = require('express');
const router = express.Router();

const {
  createEspecie,
  getEspecies,
  getEspecieById,
  updateEspecie,
  deleteEspecie,
  changeEspecieStatus,
} = require('../controllers/especie.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const {
  createEspecieValidator,
  updateEspecieValidator,
} = require('../validators/especie.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('GESTIONAR_ESPECIES'),
  createEspecieValidator,
  validateFields,
  createEspecie
);

router.get(
  '/',
  authorizePermissions('GESTIONAR_ESPECIES'),
  getEspecies
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_ESPECIES'),
  getEspecieById
);

router.put(
  '/:id',
  authorizePermissions('GESTIONAR_ESPECIES'),
  updateEspecieValidator,
  validateFields,
  updateEspecie
);

router.patch(
  '/:id/estado',
  authorizePermissions('GESTIONAR_ESPECIES'),
  changeEspecieStatus
);

router.delete(
  '/:id',
  authorizePermissions('GESTIONAR_ESPECIES'),
  deleteEspecie
);

module.exports = router;