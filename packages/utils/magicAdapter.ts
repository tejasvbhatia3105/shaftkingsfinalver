// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type Connection,
  type Transaction as TransactionType,
  type VersionedTransaction,
} from '@solana/web3.js';

export const signTransaction = async <
  T extends TransactionType | VersionedTransaction
>(
  transaction: T,
  magic: any,
  connection: Connection
): Promise<T> => {
  const signedTransaction = await magic.solana.signTransaction(transaction, {
    requireAllSignatures: false,
    verifySignatures: true,
  });

  transaction.signatures = signedTransaction.signature;

  await connection?.sendRawTransaction(
    Buffer.from(signedTransaction?.rawTransaction as string, 'base64')
  );

  return transaction;
};

export const signAllTransactions = async <
  T extends TransactionType | VersionedTransaction
>(
  transactions: T[],
  magic: any,
  connection: Connection
): Promise<T[]> => {
  return Promise.all(
    transactions.map((tx) => signTransaction(tx, magic, connection))
  );
};
