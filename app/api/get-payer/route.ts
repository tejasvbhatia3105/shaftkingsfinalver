import { allowedOrigins } from '@/constants/authorization';
import { bs58 } from '@coral-xyz/anchor/dist/cjs/utils/bytes';
import { Keypair } from '@solana/web3.js';
import type { NextRequest} from 'next/server';
import { NextResponse } from 'next/server';

export function GET(request: NextRequest) {
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

  const { FEE_PAY } = process.env;
  if (!FEE_PAY) {
    return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
  }

    const secret = FEE_PAY;
    const secretKeyUint8 = bs58.decode(secret);
    const feePayerKeypair = Keypair.fromSecretKey(secretKeyUint8);
    const feePayer = feePayerKeypair.publicKey;

    return NextResponse.json({ feePayer: feePayer.toBase58() });
}
