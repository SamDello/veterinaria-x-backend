const express = require('express');
const router = express.Router();

const {
  getDashboardResumen
} = require('../controllers/dashboard.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');

router.use(authenticateJWT);

router.get(
  '/resumen',
  authorizePermissions('VER_DASHBOARD_ADMIN'),
  getDashboardResumen
);

module.exports = router;