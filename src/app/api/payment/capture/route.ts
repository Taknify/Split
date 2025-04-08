import { NextRequest, NextResponse } from 'next/server';
import { capturePaymentIntent } from '../../../../lib/stripe/paymentHelpers';

export async function POST(req: NextRequest) {
  try {
    const { 
      paymentIntentId,
      amount // Optional - can capture partial amount
    } = await req.json();
    
    // Validate the request
    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Payment intent ID is required' }, { status: 400 });
    }
    
    // If amount is provided, validate it
    if (amount !== undefined && (isNaN(amount) || amount <= 0)) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    
    // Capture the payment intent
    const paymentIntent = await capturePaymentIntent(paymentIntentId, amount);
    
    return NextResponse.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      amount_received: paymentIntent.amount_received / 100, // Convert from cents to dollars
    });
  } catch (error: any) {
    console.error('Payment intent capture error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}