const express = require('express');
const router = express.Router();

const {
  createTraspaso,
  getTraspasos,
  getTraspasoById
} = require('../controllers/traspaso.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const { createTraspasoValidator } = require('../validators/traspaso.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('GESTIONAR_TRASPASOS'),
  createTraspasoValidator,
  validateFields,
  createTraspaso
);

router.get(
  '/',
  authorizePermissions('GESTIONAR_TRASPASOS'),
  getTraspasos
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_TRASPASOS'),
  getTraspasoById
);

module.exports = router;