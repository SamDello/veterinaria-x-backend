const { body } = require('express-validator');

const createPagoValidator = [
  body('id_venta')
    .notEmpty()
    .withMessage('El id_venta es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_venta debe ser un entero mayor a 0.'),

  body('id_metodo_pago')
    .notEmpty()
    .withMessage('El id_metodo_pago es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_metodo_pago debe ser un entero mayor a 0.'),

  body('monto')
    .notEmpty()
    .withMessage('El monto es obligatorio.')
    .isDecimal()
    .withMessage('El monto debe ser un decimal valido.'),

  body('estado')
    .optional()
    .isIn(['PENDIENTE', 'PAGADO', 'ANULADO', 'EXPIRADO'])
    .withMessage('El estado debe ser PENDIENTE, PAGADO, ANULADO o EXPIRADO.'),
];

module.exports = {
  createPagoValidator,
};