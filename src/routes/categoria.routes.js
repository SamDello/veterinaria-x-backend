const express = require('express');
const router = express.Router();

const {
  createCategoria,
  getCategorias,
  getCategoriaById,
  updateCategoria,
  changeCategoriaStatus,
} = require('../controllers/categoria.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const {
  createCategoriaValidator,
} = require('../validators/categoria.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('GESTIONAR_CATEGORIAS'),
  createCategoriaValidator,
  validateFields,
  createCategoria
);

router.get(
  '/',
  authorizePermissions('GESTIONAR_CATEGORIAS'),
  getCategorias
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_CATEGORIAS'),
  getCategoriaById
);

router.put(
  '/:id',
  authorizePermissions('GESTIONAR_CATEGORIAS'),
  createCategoriaValidator,
  validateFields,
  updateCategoria
);

router.patch(
  '/:id/estado',
  authorizePermissions('GESTIONAR_CATEGORIAS'),
  changeCategoriaStatus
);

module.exports = router;