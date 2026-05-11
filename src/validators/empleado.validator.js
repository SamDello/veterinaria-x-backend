const { body } = require('express-validator');

const createEmpleadoValidator = [
  body('id_usuario')
    .notEmpty()
    .withMessage('El id_usuario es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_usuario debe ser un entero mayor a 0.'),

  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es obligatorio.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('apellidos')
    .trim()
    .notEmpty()
    .withMessage('Los apellidos son obligatorios.')
    .isLength({ min: 2, max: 150 })
    .withMessage('Los apellidos deben tener entre 2 y 150 caracteres.'),

  body('ci')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('El CI no debe exceder 30 caracteres.'),

  body('telefono')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('El telefono no debe exceder 30 caracteres.'),

  body('direccion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La direccion no debe exceder 255 caracteres.'),

  body('cargo')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El cargo no debe exceder 100 caracteres.'),

  body('especialidad')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La especialidad no debe exceder 100 caracteres.'),
];

const updateEmpleadoValidator = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre no puede estar vacio.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('apellidos')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Los apellidos no pueden estar vacios.')
    .isLength({ min: 2, max: 150 })
    .withMessage('Los apellidos deben tener entre 2 y 150 caracteres.'),

  body('ci')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('El CI no debe exceder 30 caracteres.'),

  body('telefono')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('El telefono no debe exceder 30 caracteres.'),

  body('direccion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La direccion no debe exceder 255 caracteres.'),

  body('cargo')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('El cargo no debe exceder 100 caracteres.'),

  body('especialidad')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('La especialidad no debe exceder 100 caracteres.'),

  body('estado')
    .optional()
    .isBoolean()
    .withMessage('El estado debe ser true o false.'),
];

module.exports = {
  createEmpleadoValidator,
  updateEmpleadoValidator,
};