export default (price: number | string): string => {
  if (typeof price === 'string') {
    price = parseInt(price);
  } else if (typeof price !== 'number') {
    throw new Error('Price must be a number or a string');
  }

  return `${(price / 100).toFixed(2)} PHP`;
};
