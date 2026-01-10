import type { WalletContextState } from '@solana/wallet-adapter-react';

export const signMessage = async (msg: string, wallet: WalletContextState) => {
  if (!wallet || !wallet.signMessage) {
    throw new Error('Wallet not connected');
  }

  const message = new TextEncoder().encode(msg);
  const signature = await wallet?.signMessage(message);

  const signatureBase64 = Buffer.from(signature).toString('base64');
  return signatureBase64;
};
