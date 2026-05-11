const { body } = require('express-validator');

const createServicioVeterinarioValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre del servicio es obligatorio.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripción no debe exceder 255 caracteres.'),

  body('precio')
    .notEmpty()
    .withMessage('El precio es obligatorio.')
    .isDecimal()
    .withMessage('El precio debe ser un valor decimal válido.'),
];

const updateServicioVeterinarioValidator = createServicioVeterinarioValidator;

module.exports = {
  createServicioVeterinarioValidator,
  updateServicioVeterinarioValidator,
};