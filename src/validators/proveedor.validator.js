const { body } = require('express-validator');

const createProveedorValidator = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre del proveedor es obligatorio.')
    .isLength({ min: 2, max: 150 })
    .withMessage('El nombre debe tener entre 2 y 150 caracteres.'),

  body('nit')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('El NIT no debe exceder 30 caracteres.'),

  body('telefono')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('El telefono no debe exceder 30 caracteres.'),

  body('correo')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Debe ingresar un correo valido.'),

  body('direccion')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('La direccion no debe exceder 255 caracteres.'),
];

const updateProveedorValidator = createProveedorValidator;

module.exports = {
  createProveedorValidator,
  updateProveedorValidator,
};