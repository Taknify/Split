import { NextRequest, NextResponse } from 'next/server';
import { createPaymentIntent } from '../../../../lib/stripe/paymentHelpers';

export async function POST(req: NextRequest) {
  try {
    const { 
      amount, 
      currency = 'usd', 
      description, 
      metadata = {},
      customerId,
      captureMethod = 'automatic'
    } = await req.json();
    
    // Validate the request
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    
    // Create a PaymentIntent
    const paymentIntent = await createPaymentIntent({
      amount,
      currency,
      description,
      metadata,
      customerId,
      captureMethod
    });
    
    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    });
  } catch (error: any) {
    console.error('Payment intent creation error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Endpoint to confirm a payment intent
export async function PUT(req: NextRequest) {
  try {
    const { 
      paymentIntentId,
      paymentMethodId
    } = await req.json();
    
    // Validate the request
    if (!paymentIntentId) {
      return NextResponse.json({ error: 'Payment intent ID is required' }, { status: 400 });
    }
    
    if (!paymentMethodId) {
      return NextResponse.json({ error: 'Payment method ID is required' }, { status: 400 });
    }
    
    // Import stripe client here to avoid circular dependencies
    const stripe = (await import('../../../../lib/stripe/stripeClient')).default;
    
    // Confirm the payment intent
    const paymentIntent = await stripe.paymentIntents.confirm(
      paymentIntentId,
      {
        payment_method: paymentMethodId,
      }
    );
    
    return NextResponse.json({
      id: paymentIntent.id,
      status: paymentIntent.status,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error('Payment intent confirmation error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}