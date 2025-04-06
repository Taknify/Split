import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});
export async function POST(req: NextRequest) {
  try {
    const { amount, currency = 'usd', description, metadata } = await req.json();
    // Validate the request
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }
    // Create a PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency,
      description,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
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
