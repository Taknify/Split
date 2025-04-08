import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import stripe from '../../../../lib/stripe/stripeClient';
import { processWebhookEvent } from '../../../../lib/stripe/webhookHandlers';

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature') as string;
    
    // Verify the webhook signature
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }
    
    // Process the webhook event
    const context = {
      // Add any services or context needed by handlers
    };
    
    await processWebhookEvent(event, context);
    
    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}