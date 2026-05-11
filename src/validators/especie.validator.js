const { body } = require('express-validator');

const createEspecieValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la especie es obligatorio.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripción no debe exceder 255 caracteres.'),
];

const updateEspecieValidator = createEspecieValidator;

module.exports = {
  createEspecieValidator,
  updateEspecieValidator,
};