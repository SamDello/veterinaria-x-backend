const express = require('express');
const router = express.Router();

const {
  getEmpleados,
  getEmpleadoById,
  createEmpleado,
  updateEmpleado,
  changeEmpleadoStatus,
} = require('../controllers/empleado.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');

const {
  createEmpleadoValidator,
  updateEmpleadoValidator,
} = require('../validators/empleado.validator');

router.use(authenticateJWT);

router.get(
  '/',
  authorizePermissions('GESTIONAR_EMPLEADOS'),
  getEmpleados
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_EMPLEADOS'),
  getEmpleadoById
);

router.post(
  '/',
  authorizePermissions('GESTIONAR_EMPLEADOS'),
  createEmpleadoValidator,
  validateFields,
  createEmpleado
);

router.put(
  '/:id',
  authorizePermissions('GESTIONAR_EMPLEADOS'),
  updateEmpleadoValidator,
  validateFields,
  updateEmpleado
);

router.patch(
  '/:id/estado',
  authorizePermissions('GESTIONAR_EMPLEADOS'),
  changeEmpleadoStatus
);

module.exports = router;