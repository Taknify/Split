/**
 * Server-side Stripe client for secure API operations
 */
import Stripe from 'stripe';

// Initialize Stripe with the secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: '2023-10-16', // Use a compatible API version
  appInfo: {
    name: 'SplitApp',
    version: '1.0.0',
  },
});

export default stripe;