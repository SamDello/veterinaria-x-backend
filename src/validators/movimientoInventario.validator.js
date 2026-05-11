const { body } = require('express-validator');

const createMovimientoInventarioValidator = [
  body('id_producto')
    .notEmpty()
    .withMessage('El id_producto es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_producto debe ser un entero mayor a 0.'),

  body('id_almacen')
    .notEmpty()
    .withMessage('El id_almacen es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_almacen debe ser un entero mayor a 0.'),

  body('id_empleado')
    .notEmpty()
    .withMessage('El id_empleado es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_empleado debe ser un entero mayor a 0.'),

  body('tipo_movimiento')
    .notEmpty()
    .withMessage('El tipo_movimiento es obligatorio.')
    .isIn(['INGRESO', 'SALIDA', 'AJUSTE'])
    .withMessage('El tipo_movimiento debe ser INGRESO, SALIDA o AJUSTE.'),

  body('cantidad')
    .notEmpty()
    .withMessage('La cantidad es obligatoria.')
    .isInt({ min: 0 })
    .withMessage('La cantidad debe ser un entero mayor o igual a 0.'),

  body('motivo')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('El motivo no puede superar 255 caracteres.'),

  body('referencia_tipo')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('La referencia_tipo no puede superar 50 caracteres.'),

  body('referencia_id')
    .optional({ nullable: true, checkFalsy: true })
    .isInt({ gt: 0 })
    .withMessage('La referencia_id debe ser un entero mayor a 0.'),

  body('fecha')
    .optional()
    .isISO8601()
    .withMessage('La fecha debe tener un formato válido.'),
];

module.exports = {
  createMovimientoInventarioValidator,
};