// utils/formatTickerName.ts
export const tickerPrefixMap: { [key: string]: string } = {
  tDRIFT: 'DRIFT',
  tJUPITER: 'JUP',
  tPYTH: 'PYTH',
};

export const formatTickerName = (tickerName: string): string => {
  if (tickerPrefixMap[tickerName]) {
    return tickerPrefixMap[tickerName];
  }

  return tickerName.replace(/^t/, '').toUpperCase();
};
