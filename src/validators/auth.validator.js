const { body } = require('express-validator');

const registerValidator = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('El username es obligatorio.')
    .isLength({ min: 3, max: 50 })
    .withMessage('El username debe tener entre 3 y 50 caracteres.'),

  body('correo')
    .trim()
    .notEmpty()
    .withMessage('El correo es obligatorio.')
    .isEmail()
    .withMessage('Debe ingresar un correo valido.'),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria.')
    .isLength({ min: 8 })
    .withMessage('La contraseña debe tener minimo 8 caracteres.'),

  body('rol')
    .trim()
    .notEmpty()
    .withMessage('El rol es obligatorio.'),

  body('empleado.nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre del empleado no puede estar vacio.'),

  body('empleado.apellidos')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Los apellidos del empleado no pueden estar vacios.'),
];

const loginValidator = [
  body('correo')
    .trim()
    .notEmpty()
    .withMessage('El correo es obligatorio.')
    .isEmail()
    .withMessage('Debe ingresar un correo valido.'),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es obligatoria.'),
];

module.exports = {
  registerValidator,
  loginValidator,
};