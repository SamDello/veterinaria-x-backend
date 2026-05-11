const { body } = require('express-validator');

const createMetodoPagoValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre del metodo de pago es obligatorio.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripcion no debe exceder 255 caracteres.'),
];

const updateMetodoPagoValidator = createMetodoPagoValidator;

module.exports = {
  createMetodoPagoValidator,
  updateMetodoPagoValidator,
};