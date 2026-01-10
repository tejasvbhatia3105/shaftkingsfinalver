export const formatCents = (price: number | string): string => {
  const value = Number(price) * 100;
  const formatted = Number.isInteger(value)
    ? `${value}¢`
    : `${value.toFixed(1)}¢`;
  return formatted;
};
