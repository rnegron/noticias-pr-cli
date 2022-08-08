import { format, parseISO } from 'date-fns';

export default (date) => {
  return date ? format(parseISO(date), 'd/M/yyyy') : 'N/A';
};
