const express = require('express');

const {
  inicializarLotes,
  listarLotes,
  listarMovimientosLote
} = require('../controllers/fifoInventario.controller');

const router = express.Router();

router.post('/inicializar-lotes', inicializarLotes);
router.get('/lotes', listarLotes);
router.get('/movimientos', listarMovimientosLote);

module.exports = router;