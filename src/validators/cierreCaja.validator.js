const { body } = require('express-validator');

const createCierreCajaValidator = [
  body('id_apertura_caja')
    .notEmpty()
    .withMessage('El id_apertura_caja es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_apertura_caja debe ser un entero mayor a 0.'),

  body('id_empleado')
    .notEmpty()
    .withMessage('El id_empleado es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_empleado debe ser un entero mayor a 0.'),

  body('monto_final')
    .notEmpty()
    .withMessage('El monto_final es obligatorio.')
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('El monto_final debe ser un decimal válido.')
    .custom((value) => Number(value) >= 0)
    .withMessage('El monto_final no puede ser negativo.'),

  body('observacion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La observación no puede superar 255 caracteres.'),
];

module.exports = {
  createCierreCajaValidator,
};