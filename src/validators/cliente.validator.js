const { body } = require('express-validator');

const createClienteValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('apellidos')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Los apellidos no deben exceder 150 caracteres.'),

  body('ci_nit')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('El CI/NIT no debe exceder 30 caracteres.'),

  body('telefono')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('El telefono no debe exceder 30 caracteres.'),

  body('correo')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Debe ingresar un correo valido.'),

  body('direccion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La direccion no debe exceder 255 caracteres.'),
];

const updateClienteValidator = createClienteValidator;

module.exports = {
  createClienteValidator,
  updateClienteValidator,
};