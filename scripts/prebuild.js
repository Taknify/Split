// This script runs before the build to ensure all files are in sync
const fs = require('fs');
const path = require('path');

console.log('Running prebuild script to ensure compatibility...');

try {
  // Create directories if they don't exist
  const scriptsDir = path.join(__dirname, '..', 'scripts');
  const libDir = path.join(__dirname, '..', 'src', 'lib');
  if (!fs.existsSync(scriptsDir)) {
    fs.mkdirSync(scriptsDir, { recursive: true });
  }
  if (!fs.existsSync(libDir)) {
    fs.mkdirSync(libDir, { recursive: true });
  }

  // 1. Ensure env.js exists
  const envJsPath = path.join(libDir, 'env.js');
  const envJsContent = `/**
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
};`;

  // 2. Ensure env.ts exists
  const envTsPath = path.join(libDir, 'env.ts');
  const envTsContent = `/**
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
};`;
  
  // 3. Create or update neo4j.js
  const neo4jJsPath = path.join(libDir, 'neo4j.js');
  const neo4jJsContent = `// CommonJS version of the Neo4j client
const neo4j = require('neo4j-driver');

// Use environment variables from our env module
const { 
  NEO4J_URI,
  NEO4J_USERNAME, 
  NEO4J_PASSWORD, 
  IS_PRODUCTION,
  logger 
} = require('./env');

// Create Neo4j driver instance
const driver = neo4j.driver(
  NEO4J_URI, 
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD),
  {
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 30000,
    // Logging can be turned off in production
    logging: {
      level: IS_PRODUCTION ? 'warn' : 'info',
      logger: (level, message) => logger.log(\`[Neo4j/\${level}] \${message}\`)
    }
  }
);

// Function to run Cypher queries
async function executeQuery(cypher, params = {}) {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result.records.map(record => {
      const resultObj = {};
      record.keys.forEach(key => {
        resultObj[key] = record.get(key);
      });
      return resultObj;
    });
  } catch (error) {
    logger.error('Database error:', error);
    throw error;
  } finally {
    await session.close();
  }
}

// Example function to test connection
async function verifyConnection() {
  const session = driver.session();
  try {
    const result = await session.run('RETURN 1 AS value');
    return result.records[0].get('value') === 1;
  } catch (error) {
    logger.error('Failed to connect to Neo4j:', error);
    return false;
  } finally {
    await session.close();
  }
}

module.exports = { driver, executeQuery, verifyConnection };`;
  
  // 4. Create or update neo4j.ts
  const neo4jTsPath = path.join(libDir, 'neo4j.ts');
  const neo4jTsContent = `// TypeScript version of the Neo4j client
import neo4j from 'neo4j-driver';
import { NEO4J_URI, NEO4J_USERNAME, NEO4J_PASSWORD, IS_PRODUCTION, logger } from './env';

// Create Neo4j driver instance
export const driver = neo4j.driver(
  NEO4J_URI, 
  neo4j.auth.basic(NEO4J_USERNAME, NEO4J_PASSWORD),
  {
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 30000,
    logging: {
      level: IS_PRODUCTION ? 'warn' : 'info',
      logger: (level: string, message: string) => logger.log(\`[Neo4j/\${level}] \${message}\`)
    }
  }
);

// Function to run Cypher queries
export async function executeQuery(cypher: string, params = {}) {
  const session = driver.session();
  try {
    const result = await session.run(cypher, params);
    return result.records.map(record => {
      const resultObj: Record<string, any> = {};
      record.keys.forEach(key => {
        resultObj[key] = record.get(key);
      });
      return resultObj;
    });
  } catch (error) {
    logger.error('Database error:', error);
    throw error;
  } finally {
    await session.close();
  }
}

// Example function to test connection
export async function verifyConnection() {
  const session = driver.session();
  try {
    const result = await session.run('RETURN 1 AS value');
    return result.records[0].get('value') === 1;
  } catch (error) {
    logger.error('Failed to connect to Neo4j:', error);
    return false;
  } finally {
    await session.close();
  }
}`;

  // Write the files
  fs.writeFileSync(envJsPath, envJsContent);
  fs.writeFileSync(envTsPath, envTsContent);
  fs.writeFileSync(neo4jJsPath, neo4jJsContent);
  fs.writeFileSync(neo4jTsPath, neo4jTsContent);
  
  console.log('Created/updated env.js, env.ts, neo4j.js, and neo4j.ts files');
  console.log('Prebuild script completed successfully!');
} catch (error) {
  console.error('Error during prebuild:', error);
  process.exit(1);
}