import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16',
});

export async function POST(req: NextRequest) {
  try {
    const { 
      amount, 
      cardName, 
      expiration = 24, // Default 24 hours expiration
      merchantLock = null, 
      oneTimeUse = true,
      exactAmount = true,
      metadata = {}
    } = await req.json();

    // Validate the request
    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Calculate expiration date
    const expirationDate = new Date();
    expirationDate.setHours(expirationDate.getHours() + expiration);

    // Create a virtual card
    const card = await stripe.issuing.cards.create({
      type: 'virtual',
      currency: 'usd',
      status: 'active',
      cardholder: 'acct_test_cardholder', // In production, this would be a real cardholder ID
      spending_controls: {
        spending_limits: exactAmount ? [
          {
            amount: Math.round(amount * 100), // Convert to cents
            interval: 'per_authorization'
          }
        ] : undefined,
        allowed_categories: merchantLock ? [merchantLock] : undefined,
        blocked_categories: [],
        spending_limit_currency: 'usd'
      },
      metadata: {
        ...metadata,
        cardName: cardName || 'SplitApp Virtual Card',
        oneTimeUse: oneTimeUse ? 'true' : 'false'
      }
    });

    return NextResponse.json({
      id: card.id,
      last4: card.last4,
      status: card.status,
      // In a real implementation, you'd need to fetch the card details using the Stripe API
      // This is simplified for demonstration purposes
      card_details: {
        number: '4242XXXXXXXX4242', // Placeholder
        exp_month: 12,
        exp_year: 25,
        cvc: '123'
      }
    });
  } catch (error: any) {
    console.error('Virtual card creation error:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    // This would normally get a specific card or list cards
    // Simplified for demonstration purposes
    return NextResponse.json({
      cards: [
        {
          id: 'card_1234',
          last4: '4242',
          status: 'active',
          created: new Date().toISOString(),
          metadata: {
            cardName: 'Sample Virtual Card',
            oneTimeUse: 'true'
          }
        }
      ]
    });
  } catch (error: any) {
    console.error('Error fetching cards:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
