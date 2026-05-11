const { body } = require('express-validator');

const createMovimientoCajaValidator = [
  body('id_apertura_caja')
    .notEmpty()
    .withMessage('El id_apertura_caja es obligatorio.')
    .isInt({ gt: 0 }),

  body('id_empleado')
    .notEmpty()
    .withMessage('El id_empleado es obligatorio.')
    .isInt({ gt: 0 }),

  body('id_metodo_pago')
    .notEmpty()
    .withMessage('El id_metodo_pago es obligatorio.')
    .isInt({ gt: 0 }),

  body('tipo_movimiento')
    .notEmpty()
    .withMessage('El tipo_movimiento es obligatorio.')
    .isIn(['INGRESO', 'EGRESO'])
    .withMessage('El tipo_movimiento debe ser INGRESO o EGRESO.'),

  body('monto')
    .notEmpty()
    .withMessage('El monto es obligatorio.')
    .isDecimal()
    .withMessage('El monto debe ser un decimal valido.'),
];

module.exports = {
  createMovimientoCajaValidator,
};