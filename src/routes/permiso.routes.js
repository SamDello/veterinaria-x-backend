const express = require('express');
const router = express.Router();

const {
  getPermisos,
  getPermisoById,
} = require('../controllers/permiso.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');

router.use(authenticateJWT);

router.get(
  '/',
  authorizePermissions('GESTIONAR_PERMISOS'),
  getPermisos
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_PERMISOS'),
  getPermisoById
);

module.exports = router;