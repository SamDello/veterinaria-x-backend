const express = require('express');
const router = express.Router();

const {
  createMascota,
  getMascotas,
  getMascotaById,
  updateMascota,
  deleteMascota,
  changeMascotaStatus,
} = require('../controllers/mascota.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const { imageUpload } = require('../middlewares/upload.middleware');
const {
  createMascotaValidator,
  updateMascotaValidator,
} = require('../validators/mascota.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('GESTIONAR_MASCOTAS'),
  imageUpload.single('imagen'),
  createMascotaValidator,
  validateFields,
  createMascota
);

router.get(
  '/',
  authorizePermissions('GESTIONAR_MASCOTAS'),
  getMascotas
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_MASCOTAS'),
  getMascotaById
);

router.put(
  '/:id',
  authorizePermissions('GESTIONAR_MASCOTAS'),
  imageUpload.single('imagen'),
  updateMascotaValidator,
  validateFields,
  updateMascota
);

router.delete(
  '/:id',
  authorizePermissions('GESTIONAR_MASCOTAS'),
  deleteMascota
);

router.patch(
  '/:id/estado',
  authorizePermissions('GESTIONAR_MASCOTAS'),
  changeMascotaStatus
);

module.exports = router;