export const SOL_MINT = 'So11111111111111111111111111111111111111112';
export const USDC_MINT = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v';
export const TRD_MINT = 't3DohmswhKk94PPbPYwA6ZKACyY3y5kbcqeQerAJjmV';

export const TRD_DECIMALS = 6;

export const getTokenInfo = (token: string) => {
  const tokens: Record<string, { mint: string; decimals: number }> = {
    SOL: {
      mint: SOL_MINT,
      decimals: 9,
    },
    USDC: {
      mint: USDC_MINT,
      decimals: 6,
    },
    TRD: {
      mint: TRD_MINT,
      decimals: TRD_DECIMALS,
    },
  };

  return tokens[token];
};
