const express = require('express');
const router = express.Router();

const {
  getRoles,
  getRolById,
  createRol,
  updateRol,
  changeRolStatus,
  assignPermisosToRol,
} = require('../controllers/rol.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');

const {
  createRolValidator,
  updateRolValidator,
  assignPermisosToRolValidator,
} = require('../validators/rol.validator');

router.use(authenticateJWT);

router.get(
  '/',
  authorizePermissions('GESTIONAR_ROLES'),
  getRoles
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_ROLES'),
  getRolById
);

router.post(
  '/',
  authorizePermissions('GESTIONAR_ROLES'),
  createRolValidator,
  validateFields,
  createRol
);

router.put(
  '/:id',
  authorizePermissions('GESTIONAR_ROLES'),
  updateRolValidator,
  validateFields,
  updateRol
);

router.patch(
  '/:id/estado',
  authorizePermissions('GESTIONAR_ROLES'),
  changeRolStatus
);

router.patch(
  '/:id/permisos',
  authorizePermissions('GESTIONAR_ROLES'),
  assignPermisosToRolValidator,
  validateFields,
  assignPermisosToRol
);

module.exports = router;