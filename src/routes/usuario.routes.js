const express = require('express');
const router = express.Router();

const {
  getUsuarios,
  getUsuarioById,
  createUsuario,
  updateUsuario,
  changeUsuarioStatus,
  assignRolesToUsuario,
} = require('../controllers/usuario.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');

const {
  createUsuarioValidator,
  updateUsuarioValidator,
  assignRolesToUsuarioValidator,
} = require('../validators/usuario.validator');

router.use(authenticateJWT);

router.get(
  '/',
  authorizePermissions('GESTIONAR_USUARIOS'),
  getUsuarios
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_USUARIOS'),
  getUsuarioById
);

router.post(
  '/',
  authorizePermissions('GESTIONAR_USUARIOS'),
  createUsuarioValidator,
  validateFields,
  createUsuario
);

router.put(
  '/:id',
  authorizePermissions('GESTIONAR_USUARIOS'),
  updateUsuarioValidator,
  validateFields,
  updateUsuario
);

router.patch(
  '/:id/estado',
  authorizePermissions('GESTIONAR_USUARIOS'),
  changeUsuarioStatus
);

router.patch(
  '/:id/roles',
  authorizePermissions('GESTIONAR_USUARIOS'),
  assignRolesToUsuarioValidator,
  validateFields,
  assignRolesToUsuario
);

module.exports = router;