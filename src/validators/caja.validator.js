const { body } = require('express-validator');

const createCajaValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la caja es obligatorio.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 255 }),

  body('ubicacion')
    .optional()
    .trim()
    .isLength({ max: 255 }),
];

module.exports = {
  createCajaValidator,
};