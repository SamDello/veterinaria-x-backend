const express = require('express');
const router = express.Router();

const {
  createStock,
  getStocks,
  getStockById,
  updateStock,
} = require('../controllers/stock.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const { createStockValidator } = require('../validators/stock.validator');

router.use(authenticateJWT);

router.post(
  '/',
  authorizePermissions('GESTIONAR_STOCK'),
  createStockValidator,
  validateFields,
  createStock
);

router.get(
  '/',
  authorizePermissions('GESTIONAR_STOCK'),
  getStocks
);

router.get(
  '/:id',
  authorizePermissions('GESTIONAR_STOCK'),
  getStockById
);

router.put(
  '/:id',
  authorizePermissions('GESTIONAR_STOCK'),
  createStockValidator,
  validateFields,
  updateStock
);

module.exports = router;