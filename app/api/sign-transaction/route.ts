import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { Keypair, VersionedTransaction } from '@solana/web3.js';
import { allowedOrigins } from '@/constants/authorization';


export async function POST(request: NextRequest) {
  const origin = request.headers.get('origin');
  const referer = request.headers.get('referer');

  const isAllowed = allowedOrigins.some((o) => {
    const normalizedOrigin = origin?.replace(/\/$/, '') || '';
    const normalizedReferer = referer?.replace(/\/$/, '') || '';
    const normalizedAllowed = o.replace(/\/$/, '');

    return (
      normalizedOrigin.includes(normalizedAllowed) ||
      normalizedReferer.includes(normalizedAllowed)
    );
  });

  if (!isAllowed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { transaction } = await request.json();

  const { FEE_PAY } = process.env;
  if (!FEE_PAY) {
    return NextResponse.json(
      { error: 'Server configuration error' },
      { status: 500 }
    );
  }

  const deserializedTransaction = VersionedTransaction.deserialize(
    Buffer.from(transaction, 'base64')
  );

  const secret = FEE_PAY;
  const secretKeyUint8 = bs58.decode(secret);
  const feePayerKeypair = Keypair.fromSecretKey(secretKeyUint8);

  deserializedTransaction.sign([feePayerKeypair]);

  const signedTx = Buffer.from(deserializedTransaction.serialize()).toString(
    'base64'
  );

  return NextResponse.json({ transaction: signedTx });
}
