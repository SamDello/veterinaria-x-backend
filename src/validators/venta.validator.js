const { body } = require('express-validator');

const createVentaValidator = [
  body('id_cliente')
    .notEmpty()
    .withMessage('El id_cliente es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_cliente debe ser un entero mayor a 0.'),

  body('id_empleado')
    .notEmpty()
    .withMessage('El id_empleado es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_empleado debe ser un entero mayor a 0.'),

  body('productos')
    .optional()
    .isArray()
    .withMessage('Productos debe ser un arreglo.'),

  body('servicios')
    .optional()
    .isArray()
    .withMessage('Servicios debe ser un arreglo.'),

  body('id_atencion')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('El id_atencion debe ser un entero mayor a 0.'),
];

module.exports = {
  createVentaValidator,
};