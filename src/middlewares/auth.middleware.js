const { verifyToken } = require('../utils/jwt');

function authenticateJWT(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        message: 'Token no proporcionado.',
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      ok: false,
      message: 'Token invalido vuelva iniciar sesion.',
    });
  }
}

module.exports = {
  authenticateJWT,
};