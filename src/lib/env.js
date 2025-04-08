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
const NEO4J_URI = process.env.NEO4J_URI || 'bolt://localhost:7687';
const NEO4J_USERNAME = process.env.NEO4J_USERNAME || 'neo4j';
const NEO4J_PASSWORD = process.env.NEO4J_PASSWORD || 'password';

// NextAuth config
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000';
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || 'your-nextauth-secret-key';

// Stripe config
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || '';
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';
const STRIPE_WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET || '';
const STRIPE_CARDHOLDER_ID = process.env.STRIPE_CARDHOLDER_ID || '';

// Environment
const NODE_ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = NODE_ENV === 'production';
const IS_DEVELOPMENT = NODE_ENV === 'development';

// Logger that only logs in development
const logger = {
  log: (...args) => {
    if (IS_DEVELOPMENT) {
      console.log(...args);
    }
  },
  error: (...args) => {
    console.error(...args);
  },
  warn: (...args) => {
    console.warn(...args);
  },
  info: (...args) => {
    if (IS_DEVELOPMENT) {
      console.info(...args);
    }
  }
};

module.exports = {
  NEO4J_URI,
  NEO4J_USERNAME,
  NEO4J_PASSWORD,
  NEXTAUTH_URL,
  NEXTAUTH_SECRET,
  STRIPE_SECRET_KEY,
  STRIPE_PUBLISHABLE_KEY,
  STRIPE_WEBHOOK_SECRET,
  STRIPE_CARDHOLDER_ID,
  NODE_ENV,
  IS_PRODUCTION,
  IS_DEVELOPMENT,
  logger
};