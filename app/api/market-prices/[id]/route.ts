import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  if (!id) {
    return NextResponse.json({ error: 'Market ID required' }, { status: 400 });
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const cloudflareSecret = process.env.CLOUDFLARE_SECRET;

    if (!apiUrl) {
      console.warn('API URL not configured');
      return NextResponse.json([]);
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (cloudflareSecret) {
      headers['cloudflare-secret'] = cloudflareSecret;
    }

    const response = await fetch(`${apiUrl}/market/${id}/price`, {
      method: 'GET',
      headers,
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error('Failed to fetch market prices:', response.status);
      return NextResponse.json([]);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching market prices:', error);
    return NextResponse.json([]);
  }
}

