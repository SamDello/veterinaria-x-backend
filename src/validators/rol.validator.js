const { body } = require('express-validator');

const createRolValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre del rol es obligatorio.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del rol debe tener entre 2 y 100 caracteres.'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripcion no debe exceder 255 caracteres.'),
];

const updateRolValidator = [
  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre del rol no puede estar vacio.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre del rol debe tener entre 2 y 100 caracteres.'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripcion no debe exceder 255 caracteres.'),

  body('estado')
    .optional()
    .isBoolean()
    .withMessage('El estado debe ser true o false.'),
];

const assignPermisosToRolValidator = [
  body('permisos')
    .isArray({ min: 1 })
    .withMessage('Debe enviar al menos un permiso.'),

  body('permisos.*')
    .isInt({ gt: 0 })
    .withMessage('Cada permiso debe ser un id entero mayor a 0.'),
];

module.exports = {
  createRolValidator,
  updateRolValidator,
  assignPermisosToRolValidator,
};