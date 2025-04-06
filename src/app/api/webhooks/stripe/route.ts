import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', // Use the latest API version
});

// Configure the webhook secret
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

    // Handle specific webhook events
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
        // TODO: Update database, notify users, etc.
        break;
        
      case 'charge.succeeded':
        const charge = event.data.object as Stripe.Charge;
        console.log(`Charge for ${charge.amount} was successful!`);
        // TODO: Update database, notify users, etc.
        break;
        
      case 'issuing_authorization.request':
        const authorization = event.data.object as any; // Using any for now until proper typing is added
        console.log(`Virtual card authorization request for ${authorization.amount}`);
        // TODO: Approve/decline the authorization
        break;
        
      // Add more event handlers as needed
      
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error(`Webhook error: ${error.message}`);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}
