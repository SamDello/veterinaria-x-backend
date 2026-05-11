const express = require('express');
const router = express.Router();

const {
  createAtencionVeterinaria,
  getAtencionesVeterinarias,
  getAtencionVeterinariaById,
  updateAtencionVeterinaria,
  changeAtencionVeterinariaStatus,
} = require('../controllers/atencionVeterinaria.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const {
  createAtencionVeterinariaValidator,
  updateAtencionVeterinariaValidator,
} = require('../validators/atencionVeterinaria.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('REGISTRAR_ATENCION_VETERINARIA'),
  createAtencionVeterinariaValidator,
  validateFields,
  createAtencionVeterinaria
);

router.get(
  '/',
  authorizePermissions('REGISTRAR_ATENCION_VETERINARIA'),
  getAtencionesVeterinarias
);

router.get(
  '/:id',
  authorizePermissions('REGISTRAR_ATENCION_VETERINARIA'),
  getAtencionVeterinariaById
);

router.put(
  '/:id',
  authorizePermissions('REGISTRAR_ATENCION_VETERINARIA'),
  updateAtencionVeterinariaValidator,
  validateFields,
  updateAtencionVeterinaria
);

router.patch(
  '/:id/estado',
  authorizePermissions('REGISTRAR_ATENCION_VETERINARIA'),
  changeAtencionVeterinariaStatus
);

module.exports = router;