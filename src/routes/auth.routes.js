const express = require('express');
const router = express.Router();

const { register, login, profile } = require('../controllers/auth.controller');
const { authenticateJWT } = require('../middlewares/auth.middleware');
const { validateFields } = require('../middlewares/validate.middleware');
const { registerValidator, loginValidator } = require('../validators/auth.validator');

router.post('/register', registerValidator, validateFields, register);
router.post('/login', loginValidator, validateFields, login);
router.get('/profile', authenticateJWT, profile);

module.exports = router;