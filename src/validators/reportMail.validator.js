const { body } = require('express-validator');

const sendReportMailValidator = [
  body('to')
    .custom((value) => {
      if (typeof value === 'string' && value.trim() !== '') return true;
      if (Array.isArray(value) && value.length > 0) return true;
      throw new Error('Debe enviar al menos un correo destino.');
    }),

  body('to.*')
    .optional()
    .isEmail()
    .withMessage('Todos los correos del arreglo deben ser validos.'),

  body('subject')
    .optional()
    .isLength({ max: 200 })
    .withMessage('El asunto no debe exceder 200 caracteres.'),
];

module.exports = {
  sendReportMailValidator,
};