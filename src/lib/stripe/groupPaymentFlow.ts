/**
 * Implementation of the group payment flow for bill splitting
 */
import stripe from './stripeClient';
import { createPaymentIntent, capturePaymentIntent, createVirtualCard } from './paymentHelpers';

interface Participant {
  id: string;
  customerId?: string;
  paymentMethodId: string;
  amount: number;
}

interface GroupExpense {
  id: string;
  groupId: string;
  title: string;
  totalAmount: number;
  participants: Participant[];
}

/**
 * Process a group expense with the following flow:
 * 1. Create and confirm payment intents for all participants (manual capture)
 * 2. Create virtual card with the total amount
 * 3. Capture all participant payments
 */
export async function processGroupExpense(expense: GroupExpense) {
  // 1. Create and confirm payment intent for each participant
  const paymentIntents = [];
  
  for (const participant of expense.participants) {
    try {
      // Create payment intent with manual capture
      const paymentIntent = await createPaymentIntent({
        amount: participant.amount,
        currency: 'usd',
        customerId: participant.customerId,
        captureMethod: 'manual',
        metadata: {
          expenseId: expense.id,
          participantId: participant.id,
          groupId: expense.groupId
        }
      });
      
      // Confirm payment intent (authorization only)
      const confirmedIntent = await stripe.paymentIntents.confirm(
        paymentIntent.id,
        {
          payment_method: participant.paymentMethodId,
        }
      );
      
      paymentIntents.push(confirmedIntent);
    } catch (error) {
      // Handle payment authorization failure
      console.error(`Payment authorization failed for participant ${participant.id}:`, error);
      
      // Roll back any successful authorizations
      for (const successfulIntent of paymentIntents) {
        try {
          await stripe.paymentIntents.cancel(successfulIntent.id, {
            cancellation_reason: 'requested_by_customer'
          });
        } catch (cancellationError) {
          console.error(`Failed to cancel payment intent ${successfulIntent.id}:`, cancellationError);
        }
      }
      
      throw new Error(`Failed to authorize payment for participant ${participant.id}`);
    }
  }
  
  // 2. Verify all payment intents are successfully authorized
  const allAuthorized = paymentIntents.every(
    (intent) => intent.status === 'requires_capture'
  );
  
  if (!allAuthorized) {
    // Handle failed authorizations - this shouldn't happen if we're throwing earlier
    throw new Error('Some payments failed authorization');
  }
  
  // 3. Create virtual card using Treasury funds
  let virtualCard;
  try {
    virtualCard = await createVirtualCard({
      amount: expense.totalAmount,
      cardName: expense.title,
      metadata: {
        expenseId: expense.id,
        groupId: expense.groupId
      }
    });
  } catch (error) {
    console.error('Virtual card creation failed:', error);
    
    // Roll back payment authorizations
    for (const intent of paymentIntents) {
      try {
        await stripe.paymentIntents.cancel(intent.id, {
          cancellation_reason: 'requested_by_customer'
        });
      } catch (cancellationError) {
        console.error(`Failed to cancel payment intent ${intent.id}:`, cancellationError);
      }
    }
    
    throw new Error('Failed to create virtual card');
  }
  
  // 4. Capture all payment intents to replenish Treasury
  const captureResults = [];
  for (const intent of paymentIntents) {
    try {
      const capturedIntent = await capturePaymentIntent(intent.id);
      captureResults.push(capturedIntent);
    } catch (error) {
      console.error(`Failed to capture payment intent ${intent.id}:`, error);
      // Note: We don't roll back here, we continue capturing as many as possible
      // This requires manual reconciliation later
    }
  }
  
  // Count successful captures
  const successfulCaptures = captureResults.filter(
    (intent) => intent.status === 'succeeded'
  ).length;
  
  // 5. Return virtual card details and capture summary
  return {
    success: true,
    virtualCard: {
      id: virtualCard.id,
      last4: virtualCard.last4,
      status: virtualCard.status,
    },
    payments: {
      total: paymentIntents.length,
      captured: successfulCaptures
    }
  };
}