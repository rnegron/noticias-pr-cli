export default (value) => {
  return value
    .split(' ')
    .map((val) => val.trim())
    .filter((val) => val.length)
    .join(' ');
};
