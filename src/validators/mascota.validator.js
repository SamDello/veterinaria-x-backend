const { body } = require('express-validator');

const createMascotaValidator = [
  body('id_cliente')
    .notEmpty()
    .withMessage('El id_cliente es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_cliente debe ser un entero mayor a 0.'),

  body('id_raza')
    .notEmpty()
    .withMessage('El id_raza es obligatorio.')
    .isInt({ gt: 0 })
    .withMessage('El id_raza debe ser un entero mayor a 0.'),

  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre de la mascota es obligatorio.')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres.'),

  body('color')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('El color no debe exceder 50 caracteres.'),

  body('sexo')
    .optional()
    .isIn(['M', 'F'])
    .withMessage('El sexo debe ser M o F.'),

  body('fecha_nacimiento')
    .optional()
    .isDate()
    .withMessage('La fecha de nacimiento debe ser valida.'),

  body('peso')
    .optional()
    .isDecimal()
    .withMessage('El peso debe ser un numero decimal valido.'),

  body('observaciones')
    .optional()
    .trim(),
];

const updateMascotaValidator = createMascotaValidator;

module.exports = {
  createMascotaValidator,
  updateMascotaValidator,
};