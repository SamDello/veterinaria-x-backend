const { body } = require('express-validator');

const createRazaValidator = [
  body('id_especie')
    .notEmpty()
    .withMessage('El id_especie es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_especie debe ser un entero mayor a 0.'),

  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la raza es obligatorio.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripción no debe exceder 255 caracteres.'),
];

const updateRazaValidator = createRazaValidator;

module.exports = {
  createRazaValidator,
  updateRazaValidator,
};