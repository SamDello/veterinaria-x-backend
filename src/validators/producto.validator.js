const { body } = require('express-validator');

const createProductoValidator = [
  body('id_categoria')
    .notEmpty()
    .withMessage('El id_categoria es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_categoria debe ser un entero mayor a 0.'),

  body('id_marca')
    .notEmpty()
    .withMessage('El id_marca es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_marca debe ser un entero mayor a 0.'),

  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre del producto es obligatorio.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La descripcion no debe exceder 255 caracteres.'),

  body('precio_compra')
    .notEmpty()
    .withMessage('El precio de compra es obligatorio.')
    .isDecimal()
    .withMessage('El precio de compra debe ser un decimal valido.'),

  body('precio_venta')
    .notEmpty()
    .withMessage('El precio de venta es obligatorio.')
    .isDecimal()
    .withMessage('El precio de venta debe ser un decimal valido.'),
];

const updateProductoValidator = createProductoValidator;

module.exports = {
  createProductoValidator,
  updateProductoValidator,
};