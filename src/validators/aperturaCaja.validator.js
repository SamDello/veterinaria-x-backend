const { body } = require('express-validator');

const createAperturaCajaValidator = [
  body('id_caja')
    .notEmpty()
    .withMessage('El id_caja es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_caja debe ser un entero mayor a 0.'),

  body('id_empleado')
    .notEmpty()
    .withMessage('El id_empleado es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_empleado debe ser un entero mayor a 0.'),

  body('monto_inicial')
    .notEmpty()
    .withMessage('El monto_inicial es obligatorio.')
    .isDecimal({ decimal_digits: '0,2' })
    .withMessage('El monto_inicial debe ser un decimal válido.')
    .custom((value) => Number(value) >= 0)
    .withMessage('El monto_inicial no puede ser negativo.'),
];

module.exports = {
  createAperturaCajaValidator,
};