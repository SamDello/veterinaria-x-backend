const { body } = require('express-validator');

const createUsuarioValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El username es obligatorio.')
    .isLength({ min: 3, max: 100 })
    .withMessage('El username debe tener entre 3 y 100 caracteres.'),

  body('correo')
    .trim()
    .notEmpty()
    .withMessage('El correo es obligatorio.')
    .isEmail()
    .withMessage('Debe ingresar un correo valido.'),

  body('password')
    .trim()
    .notEmpty()
    .withMessage('La contraseña es obligatoria.')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres.'),

  body('roles')
    .isArray({ min: 1 })
    .withMessage('Debe enviar al menos un rol.'),

  body('roles.*')
    .isInt({ gt: 0 })
    .withMessage('Cada rol debe ser un id entero mayor a 0.'),
];

const updateUsuarioValidator = [
  body('username')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El username no puede estar vacio.')
    .isLength({ min: 3, max: 100 })
    .withMessage('El username debe tener entre 3 y 100 caracteres.'),

  body('correo')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Debe ingresar un correo valido.'),

  body('password')
    .optional()
    .trim()
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener al menos 8 caracteres.'),
];

const assignRolesToUsuarioValidator = [
  body('roles')
    .isArray({ min: 1 })
    .withMessage('Debe enviar al menos un rol.'),

  body('roles.*')
    .isInt({ gt: 0 })
    .withMessage('Cada rol debe ser un id entero mayor a 0.'),
];

module.exports = {
  createUsuarioValidator,
  updateUsuarioValidator,
  assignRolesToUsuarioValidator,
};