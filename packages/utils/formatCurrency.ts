/* eslint-disable eslint-comments/disable-enable-pair */
/* eslint-disable consistent-return */

import { truncateToTwoDecimals } from './truncateToTwoDecimals';

export const formatCurrency = (
  number: number | undefined | null = 0,
  noCurrency?: boolean
) => {
  if (number === undefined || number === null) return;

  if (Number.isNaN(number)) {
    return '$0.00';
  }

  let replaceNumber = number.toString().replace(',', '');

  if (replaceNumber.indexOf(',') !== -1)
    replaceNumber = replaceNumber.replace(',', '.');

  const finalValue = parseFloat(replaceNumber);

  const numNew = finalValue * 100;
  const formattedValue = Math.floor(numNew) / 100;

  const styleCurrency = formattedValue.toLocaleString('en-us', {
    style: 'currency',
    currency: 'USD',
  });

  if (!noCurrency) return styleCurrency;

  return styleCurrency.replace('$', '');
};

export const formatBigNumber = (number: bigint | number, decimals = 6) =>
  Number(number.toString()) / 10 ** decimals;

export const formatNumberToShortScale = (
  num?: number | null,
  decimals?: number,
  currency?: boolean
) => {
  if (!num) return '0';

  num = Number(Number(num).toFixed(2));

  const value = formatBigNumber(num, decimals);

  if (value >= 1.0e9) {
    const numFormatted = (value / 1.0e9).toFixed(2);
    return `${numFormatted.replace(/\.00$/, '')}B`;
  }

  if (value >= 1.0e6) {
    const numFormatted = (value / 1.0e6).toFixed(2);
    return `${numFormatted.replace(/\.00$/, '')}M`;
  }

  if (value >= 1.0e3) {
    const numFormatted = (value / 1.0e3).toFixed(2);
    return `${numFormatted.replace(/\.00$/, '')}K`;
  }

  const truncatedValue = truncateToTwoDecimals(value);

  if (currency) {
    return formatCurrency(truncatedValue);
  }

  return truncatedValue.toFixed(0);
};

export const formatUsdc = (value: number) => {
  return `${formatCurrency(value)?.replace('$', '')} USDC`;
};

export const formatValueOfBig = (value: number = 0) => {
  return value;
};

export const formatTRD = (value: number, bigNumber: boolean = true) => {
  if (bigNumber) {
    return formatCurrency(formatValueOfBig(value || 0))
      ?.toString()
      .replace('$', '')
      .replace('.00', '');
  }

  return formatCurrency(value || 0)
    ?.toString()
    .replace('$', '')
    .replace('.00', '');
};
