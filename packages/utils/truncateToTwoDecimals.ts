/* fn to truncate two digits without rounding the value */

export const truncateToTwoDecimals = (num: number) => {
  return Math.trunc(num * 100) / 100;
};

export const removeDecimals = (num: number) => {
  return Number(String(num).split('.')[0]);
};
