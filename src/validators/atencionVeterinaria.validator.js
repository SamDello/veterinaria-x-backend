const { body } = require('express-validator');

const createAtencionVeterinariaValidator = [
  body('id_mascota')
    .notEmpty()
    .withMessage('El id_mascota es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_mascota debe ser un entero mayor a 0.'),

  body('id_empleado')
    .notEmpty()
    .withMessage('El id_empleado es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_empleado debe ser un entero mayor a 0.'),

  body('motivo_consulta')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('El motivo de consulta no debe exceder 255 caracteres.'),

  body('peso')
    .optional({ nullable: true, checkFalsy: true })
    .isDecimal()
    .withMessage('El peso debe ser un decimal válido.'),

  body('temperatura')
    .optional({ nullable: true, checkFalsy: true })
    .isDecimal()
    .withMessage('La temperatura debe ser un decimal válido.'),

  body('servicios')
    .optional()
    .isArray()
    .withMessage('Los servicios deben enviarse como arreglo.'),

  body('servicios.*.id_servicio')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('El id_servicio debe ser un entero mayor a 0.'),

  body('servicios.*.cantidad')
    .optional()
    .isInt({ gt: 0 })
    .withMessage('La cantidad debe ser un entero mayor a 0.'),

  body('servicios.*.precio_unitario')
    .optional({ nullable: true, checkFalsy: true })
    .isDecimal()
    .withMessage('El precio_unitario debe ser un decimal válido.'),
];

const updateAtencionVeterinariaValidator = createAtencionVeterinariaValidator;

module.exports = {
  createAtencionVeterinariaValidator,
  updateAtencionVeterinariaValidator,
};