const { body } = require('express-validator');

const createTraspasoValidator = [
  body('id_almacen_origen')
    .notEmpty()
    .withMessage('El almacén origen es obligatorio.')
    .isInt({ min: 1 })
    .withMessage('El almacén origen debe ser un ID válido.'),

  body('id_almacen_destino')
    .notEmpty()
    .withMessage('El almacén destino es obligatorio.')
    .isInt({ min: 1 })
    .withMessage('El almacén destino debe ser un ID válido.'),

  body('id_empleado')
    .optional({ nullable: true })
    .isInt({ min: 1 })
    .withMessage('El empleado debe ser un ID válido.'),

  body('observacion')
    .optional({ nullable: true })
    .isString()
    .withMessage('La observación debe ser texto.'),

  body('detalles')
    .isArray({ min: 1 })
    .withMessage('Debe enviar al menos un producto para el traspaso.'),

  body('detalles.*.id_producto')
    .notEmpty()
    .withMessage('El producto es obligatorio en cada detalle.')
    .isInt({ min: 1 })
    .withMessage('El producto debe ser un ID válido.'),

  body('detalles.*.cantidad')
    .notEmpty()
    .withMessage('La cantidad es obligatoria en cada detalle.')
    .isFloat({ gt: 0 })
    .withMessage('La cantidad debe ser mayor a cero.')
];

module.exports = {
  createTraspasoValidator
};