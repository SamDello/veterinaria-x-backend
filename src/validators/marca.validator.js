const { body } = require('express-validator');

const createMarcaValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la marca es obligatorio.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede superar 255 caracteres.'),
];

module.exports = {
  createMarcaValidator,
};