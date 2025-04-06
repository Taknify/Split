import { loadStripe } from '@stripe/stripe-js';

// Load Stripe with your publishable key from environment variables
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  throw new Error('Stripe publishable key is missing. Please check your environment variables.');
}

// Initialize Stripe promise
const stripePromise = loadStripe(stripePublishableKey);

export default stripePromise;
