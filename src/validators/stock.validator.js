const { body } = require('express-validator');

const createStockValidator = [
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

  body('stock_actual')
    .notEmpty()
    .withMessage('El stock_actual es obligatorio.')
    .isInt({ min: 0 })
    .withMessage('El stock_actual debe ser un entero mayor o igual a 0.'),

  body('stock_minimo')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock_minimo debe ser un entero mayor o igual a 0.'),

  body('stock_maximo')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock_maximo debe ser un entero mayor o igual a 0.'),
];

module.exports = {
  createStockValidator,
};