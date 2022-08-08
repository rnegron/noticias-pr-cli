import prompts from 'prompts';

import exit from './exit.js';

export default ({ message, choices, hint, warn }) =>
  prompts(
    {
      type: 'select',
      name: 'value',
      message: message || '',
      choices: choices || [],
      hint: hint || 'Utiliza las flechas para navegar; Enter para seleccionar',
      warn: warn || 'Opción deshabilitada...',
      initial: 0,
    },
    { onCancel: exit }
  );
