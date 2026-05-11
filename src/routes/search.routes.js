const express = require('express');
const router = express.Router();

const { authenticateJWT } = require('../middlewares/auth.middleware');
const { globalSearch } = require('../controllers/search.controller');

router.get('/', authenticateJWT, globalSearch);

module.exports = router;