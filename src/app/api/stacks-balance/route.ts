import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { STACKS_API_URL } from '@/lib/stacks/network';

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const address = searchParams.get('address');

  if (!address) {
    return NextResponse.json(
      { error: 'Address parameter is required' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `${STACKS_API_URL}/extended/v1/address/${address}/balances`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch balance from Stacks API');
    }

    const data = await response.json();
    
    // Convert microSTX to STX (1 STX = 1,000,000 microSTX)
    const balanceInSTX = parseInt(data.stx.balance || '0') / 1_000_000;

    return NextResponse.json({
      balance: balanceInSTX,
      locked: parseInt(data.stx.locked || '0') / 1_000_000,
    });
  } catch (error) {
    console.error('Error fetching Stacks balance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch balance', balance: 0 },
      { status: 500 }
    );
  }
}
