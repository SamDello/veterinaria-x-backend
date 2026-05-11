const express = require('express');
const router = express.Router();

const {
  createCliente,
  getClientes,
  getClienteById,
  updateCliente,
  deleteCliente,
  changeClienteStatus,
} = require('../controllers/cliente.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const {
  createClienteValidator,
  updateClienteValidator,
} = require('../validators/cliente.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('GESTIONAR_CLIENTES'),
  createClienteValidator,
  validateFields,
  createCliente
);

router.get(
  '/',
  authorizePermissions('GESTIONAR_CLIENTES'),
  getClientes
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_CLIENTES'),
  getClienteById
);

router.put(
  '/:id',
  authorizePermissions('GESTIONAR_CLIENTES'),
  updateClienteValidator,
  validateFields,
  updateCliente
);

router.delete(
  '/:id',
  authorizePermissions('GESTIONAR_CLIENTES'),
  deleteCliente
);

router.patch(
  '/:id/estado',
  authorizePermissions('GESTIONAR_CLIENTES'),
  changeClienteStatus
);

module.exports = router;