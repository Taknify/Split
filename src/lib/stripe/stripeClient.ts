import Stripe from 'stripe';

// Initialize Stripe with your secret key from environment variables
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Stripe secret key is missing. Please check your environment variables.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2023-10-16', // Use the latest API version
  appInfo: {
    name: 'SplitApp',
    version: '0.1.0',
  },
});

export default stripe;
