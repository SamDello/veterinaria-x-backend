const express = require('express');
const router = express.Router();

const {
  createServicioVeterinario,
  getServiciosVeterinarios,
  getServicioVeterinarioById,
  updateServicioVeterinario,
  deleteServicioVeterinario,
  changeServicioVeterinarioStatus,
} = require('../controllers/servicioVeterinario.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const {
  createServicioVeterinarioValidator,
  updateServicioVeterinarioValidator,
} = require('../validators/servicioVeterinario.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('GESTIONAR_SERVICIOS_VETERINARIOS'),
  createServicioVeterinarioValidator,
  validateFields,
  createServicioVeterinario
);

router.get(
  '/',
  authorizePermissions('GESTIONAR_SERVICIOS_VETERINARIOS'),
  getServiciosVeterinarios
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_SERVICIOS_VETERINARIOS'),
  getServicioVeterinarioById
);

router.put(
  '/:id',
  authorizePermissions('GESTIONAR_SERVICIOS_VETERINARIOS'),
  updateServicioVeterinarioValidator,
  validateFields,
  updateServicioVeterinario
);

router.patch(
  '/:id/estado',
  authorizePermissions('GESTIONAR_SERVICIOS_VETERINARIOS'),
  changeServicioVeterinarioStatus
);

router.delete(
  '/:id',
  authorizePermissions('GESTIONAR_SERVICIOS_VETERINARIOS'),
  deleteServicioVeterinario
);

module.exports = router;