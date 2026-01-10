import { VersionedTransaction } from '@solana/web3.js';
import type TriadProtocol from '@triadxyz/triad-protocol';

export const signFeeAndSendConfirm = async (
  tx: VersionedTransaction,
  triadSdk: TriadProtocol
) => {
  const serializedTx = tx.serialize();
  const base64Tx = Buffer.from(serializedTx).toString('base64');
  const feePaySigned = await fetch('/api/sign-transaction', {
    method: 'POST',
    body: JSON.stringify({ transaction: base64Tx })
  });

  const feePaySignedData = await feePaySigned.json();
  const signedTxBase64 = feePaySignedData.transaction;

  const signedTx = VersionedTransaction.deserialize(
    Buffer.from(signedTxBase64, 'base64')
  );

  await triadSdk.provider.sendAndConfirm(signedTx);
  return signedTx;
};
