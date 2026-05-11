const express = require('express');
const router = express.Router();

const {
  createMarca,
  getMarcas,
  getMarcaById,
  updateMarca,
  changeMarcaStatus,
} = require('../controllers/marca.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const {
  createMarcaValidator,
} = require('../validators/marca.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('GESTIONAR_MARCAS'),
  createMarcaValidator,
  validateFields,
  createMarca
);

router.get(
  '/',
  authorizePermissions('GESTIONAR_MARCAS'),
  getMarcas
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_MARCAS'),
  getMarcaById
);

router.put(
  '/:id',
  authorizePermissions('GESTIONAR_MARCAS'),
  createMarcaValidator,
  validateFields,
  updateMarca
);

router.patch(
  '/:id/estado',
  authorizePermissions('GESTIONAR_MARCAS'),
  changeMarcaStatus
);

module.exports = router;