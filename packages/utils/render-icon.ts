export const tickerIcon = (tickerName: string) => {
  switch (tickerName) {
    case 'tPYTH':
      return 'https://shdw-drive.genesysgo.net/4ftuDMfPRSxh7Qcg7BhBnSLkxR5W9szJ9bumUMSvVzdP/pyth.png';
    case 'tJUPITER':
      return 'https://res.cloudinary.com/dizd3sjux/image/upload/v1715775155/zpse3curm6kjou4oai4z.png';
    case 'tDRIFT':
      return 'https://res.cloudinary.com/dizd3sjux/image/upload/v1715774763/eqkntatwpjhgshelwwrs.png';
    default:
      return '';
  }
};
