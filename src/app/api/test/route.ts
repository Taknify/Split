import { NextRequest, NextResponse } from 'next/server';
import stripe from '../../../lib/stripe/stripeClient';

/**
 * A simple test endpoint to verify Stripe integration is working
 */
export async function GET(req: NextRequest) {
  try {
    // Attempt to access Stripe API
    const stripeInfo = await stripe.balance.retrieve();
    
    return NextResponse.json({
      status: 'success',
      message: 'Stripe is connected and working',
      availableBalance: stripeInfo.available.map(b => ({
        currency: b.currency,
        amount: b.amount / 100 // Convert from cents to dollars
      })),
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Stripe connection test failed:', error.message);
    return NextResponse.json({
      status: 'error',
      message: 'Failed to connect to Stripe',
      error: error.message
    }, { status: 500 });
  }
}