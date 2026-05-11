const { body } = require('express-validator');

const createCategoriaValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la categoria es obligatorio.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripcion no debe exceder 255 caracteres.'),
];

const updateCategoriaValidator = createCategoriaValidator;

module.exports = {
  createCategoriaValidator,
  updateCategoriaValidator,
};