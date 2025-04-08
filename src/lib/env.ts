/**
 * Safe environment variable access that works in both server and client contexts
 * This module should be used instead of directly accessing process.env
 */

// Load dotenv only in Node.js environments
if (typeof process !== 'undefined' && process.env) {
  // Only load dotenv in development
  if (process.env.NODE_ENV !== 'production') {
    // Dynamic import for dotenv (only in Node.js environment)
    try {
      // Use require for CommonJS compatibility
      const dotenv = require('dotenv');
      dotenv.config();
    } catch (error) {
      console.warn('Failed to load dotenv:', error);
    }
  }
}

// Neo4j connection details
export const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
export const NEO4J_USERNAME = process.env.NEO4J_USERNAME || 'neo4j';
export const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password';

// NextAuth config
export const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
export const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'your-nextauth-secret-key';

// Stripe config
export const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
export const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';
export const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
export const STRIPE_CARDHOLDER_ID = process.env.STRIPE_CARDHOLDER_ID || '';

// Environment
export const NODE_ENV = process.env.NODE_ENV || 'development';
export const IS_PRODUCTION = NODE_ENV === 'production';
export const IS_DEVELOPMENT = NODE_ENV === 'development';

// Logger that only logs in development
export const logger = {
  log: (...args: any[]) => {
    if (IS_DEVELOPMENT) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    console.error(...args);
  },
  warn: (...args: any[]) => {
    console.warn(...args);
  },
  info: (...args: any[]) => {
    if (IS_DEVELOPMENT) {
      console.info(...args);
    }
  }
};