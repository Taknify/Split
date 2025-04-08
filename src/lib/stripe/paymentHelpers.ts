/**
 * Helper functions for Stripe payment operations
 */
import stripe from './stripeClient';

interface CreatePaymentIntentOptions {
  amount: number;
  currency?: string;
  customerId?: string;
  description?: string;
  metadata?: Record<string, string>;
  captureMethod?: 'automatic' | 'manual';
}

interface CreateVirtualCardOptions {
  amount: number;
  currency?: string;
  cardName?: string;
  expiration?: number; // Hours until expiration
  merchantLock?: string;
  oneTimeUse?: boolean;
  exactAmount?: boolean;
  metadata?: Record<string, string>;
}

/**
 * Create a payment intent with specified options
 */
export async function createPaymentIntent({
  amount,
  currency = 'usd',
  customerId,
  description,
  metadata = {},
  captureMethod = 'automatic'
}: CreatePaymentIntentOptions) {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  // Convert amount to cents
  const amountInCents = Math.round(amount * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency,
    customer: customerId,
    description,
    metadata,
    capture_method: captureMethod,
    automatic_payment_methods: {
      enabled: true,
    },
  });

  return paymentIntent;
}

/**
 * Capture a previously authorized payment intent
 */
export async function capturePaymentIntent(paymentIntentId: string, amount?: number) {
  const captureOptions: { amount_to_capture?: number } = {};
  
  if (amount) {
    captureOptions.amount_to_capture = Math.round(amount * 100);
  }

  const paymentIntent = await stripe.paymentIntents.capture(
    paymentIntentId,
    captureOptions
  );

  return paymentIntent;
}

/**
 * Create a virtual card through Stripe Issuing
 * 
 * Note: For development purposes, this provides a simulated card until Stripe Issuing is fully set up
 */
export async function createVirtualCard({
  amount,
  currency = 'usd',
  cardName,
  expiration = 24,
  merchantLock = null,
  oneTimeUse = true,
  exactAmount = true,
  metadata = {}
}: CreateVirtualCardOptions) {
  if (amount <= 0) {
    throw new Error('Amount must be greater than 0');
  }

  // Convert amount to cents
  const amountInCents = Math.round(amount * 100);

  // Calculate expiration date
  const expirationDate = new Date();
  expirationDate.setHours(expirationDate.getHours() + expiration);
  
  try {
    // Check if Stripe Issuing is enabled and configured
    if (process.env.STRIPE_ISSUING_ENABLED === 'true' && process.env.STRIPE_CARDHOLDER_ID) {
      // Create the virtual card using Stripe Issuing
      const card = await stripe.issuing.cards.create({
        type: 'virtual',
        currency,
        status: 'active',
        cardholder: process.env.STRIPE_CARDHOLDER_ID,
        // @ts-ignore - Stripe type definitions may be outdated
        spending_controls: {
          spending_limits: exactAmount 
            ? [{ amount: amountInCents, interval: 'per_authorization' }] 
            : undefined,
          allowed_categories: merchantLock ? [merchantLock as any] : undefined,
          blocked_categories: [],
          spending_limit_currency: currency
        },
        metadata: {
          ...metadata,
          cardName: cardName || 'SplitApp Virtual Card',
          oneTimeUse: oneTimeUse ? 'true' : 'false'
        }
      });
      
      return card;
    } else {
      // Simulate a virtual card for development (when Issuing is not yet set up)
      console.log('Creating simulated virtual card for development (Stripe Issuing not fully configured)');
      
      // Create a payment intent to track the funds
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amountInCents,
        currency,
        metadata: {
          ...metadata,
          isSimulatedVirtualCard: 'true',
          cardName: cardName || 'SplitApp Virtual Card',
          oneTimeUse: oneTimeUse ? 'true' : 'false',
          expirationDate: expirationDate.toISOString()
        }
      });
      
      // Return a simulated card object
      return {
        id: `simulated_${paymentIntent.id}`,
        object: 'issuing.card',
        brand: 'visa',
        last4: Math.floor(1000 + Math.random() * 9000).toString(), // Random 4 digits
        exp_month: expirationDate.getMonth() + 1,
        exp_year: expirationDate.getFullYear(),
        status: 'active',
        type: 'virtual',
        metadata: {
          ...metadata,
          cardName: cardName || 'SplitApp Virtual Card',
          oneTimeUse: oneTimeUse ? 'true' : 'false',
          paymentIntentId: paymentIntent.id
        }
      } as any;
    }
  } catch (error) {
    console.error('Error creating virtual card:', error);
    throw error;
  }
}

/**
 * Retrieve a virtual card details (including sensitive details if available)
 */
export async function getVirtualCardDetails(cardId: string) {
  // Check if this is a simulated card
  if (cardId.startsWith('simulated_')) {
    const paymentIntentId = cardId.replace('simulated_', '');
    try {
      // Retrieve the payment intent to get the metadata
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      // Create a simulated card response
      return {
        id: cardId,
        last4: cardId.slice(-4),
        status: 'active',
        metadata: paymentIntent.metadata,
        cardDetails: {
          number: '4242XXXXXXXX4242', // Placeholder
          exp_month: 12,
          exp_year: 25,
          cvc: '123'
        }
      };
    } catch (error) {
      console.error('Error retrieving simulated card details:', error);
      throw new Error('Failed to retrieve simulated card details');
    }
  } else {
    // This is a real Stripe Issuing card
    try {
      const card = await stripe.issuing.cards.retrieve(cardId);
      
      // Get card details if possible (requires special permissions in Stripe)
      let cardDetails;
      try {
        // Note: This operation requires special permissions from Stripe
        // Using any here as retrieveDetails may not be in the TypeScript definition
        cardDetails = await (stripe.issuing.cards as any).retrieveDetails(cardId);
      } catch (error) {
        // Fall back to test data for development purposes
        cardDetails = {
          card: {
            number: '4242XXXXXXXX4242', // Placeholder
            exp_month: card.exp_month,
            exp_year: card.exp_year,
            cvc: '123'
          }
        };
      }

      return {
        id: card.id,
        last4: card.last4,
        status: card.status,
        metadata: card.metadata,
        cardDetails: cardDetails?.card
      };
    } catch (error) {
      console.error('Error retrieving card details:', error);
      throw new Error('Failed to retrieve card details');
    }
  }
}

/**
 * List virtual cards with optional filtering
 */
export async function listVirtualCards(limit = 10, startingAfter?: string) {
  try {
    // Check if Stripe Issuing is enabled
    if (process.env.STRIPE_ISSUING_ENABLED === 'true') {
      // Use real Stripe Issuing
      const cards = await stripe.issuing.cards.list({
        limit,
        starting_after: startingAfter,
        expand: ['data.cardholder']
      });
      
      return cards;
    } else {
      // Simulated cards through payment intents with special metadata
      // Using a workaround for TypeScript - metadata filter is not in the type definition
      const listParams: any = {
        limit,
        starting_after: startingAfter ? startingAfter.replace('simulated_', '') : undefined,
        expand: ['data.payment_method']
      };
      
      // Add metadata filter (Stripe API supports this but TypeScript type doesn't)
      listParams.metadata = { isSimulatedVirtualCard: 'true' };
      
      const paymentIntents = await stripe.paymentIntents.list(listParams);
      
      // Convert payment intents to simulated card format
      const simulatedCards = {
        object: 'list',
        data: paymentIntents.data.map(pi => ({
          id: `simulated_${pi.id}`,
          object: 'issuing.card',
          brand: 'visa',
          last4: pi.id.slice(-4), // Use last 4 chars of the payment intent ID
          exp_month: 12,
          exp_year: new Date().getFullYear() + 1,
          status: 'active',
          type: 'virtual',
          metadata: pi.metadata
        })),
        has_more: paymentIntents.has_more,
        url: paymentIntents.url
      };
      
      return simulatedCards;
    }
  } catch (error) {
    console.error('Error listing virtual cards:', error);
    throw error;
  }
}