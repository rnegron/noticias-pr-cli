'use strict';

const prompts = require('prompts');

function onCancel (prompt) {
  prompt.fail('Cancelado');
}

module.exports = ({ message, choices, hint, warn }) =>
  prompts(
    {
      type: 'select',
      name: 'value',
      message: message || '',
      choices: choices || [],
      hint: hint || 'Utiliza las flechas para navegar; Enter para seleccionar',
      warn: warn || 'Opción deshabilitada...',
      initial: 0
    },
    { onCancel }
  );
