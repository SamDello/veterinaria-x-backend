const { body } = require('express-validator');

const createCompraValidator = [
  body('id_proveedor')
    .notEmpty()
    .withMessage('El id_proveedor es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_proveedor debe ser un entero mayor a 0.'),

  body('id_empleado')
    .notEmpty()
    .withMessage('El id_empleado es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_empleado debe ser un entero mayor a 0.'),

  body('id_almacen')
    .notEmpty()
    .withMessage('El id_almacen es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_almacen debe ser un entero mayor a 0.'),

  body('detalles')
    .isArray({ min: 1 })
    .withMessage('Debe enviar al menos un detalle de compra.'),
];

module.exports = {
  createCompraValidator,
};