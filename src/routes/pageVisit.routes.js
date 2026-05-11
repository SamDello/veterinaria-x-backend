const express = require('express');
const router = express.Router();

const {
  registerPageVisit,
  getPageVisit,
  getAllPageVisits,
} = require('../controllers/pageVisit.controller');

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { authorizePermissions } = require('../middlewares/authorization.middleware');

// Registrar visita de pagina
router.post('/', registerPageVisit);

// Consultar visitas de una pagina
router.get('/:page_key', getPageVisit);

// Consultar todas las visitas
// router.get(
//   '/',
//   authenticateJWT,
//   authorizePermissions('CONSULTAR_REPORTES_OPERATIVOS'),
//   getAllPageVisits
// );

router.get('/', getAllPageVisits);

module.exports = router;