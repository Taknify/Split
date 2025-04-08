// CommonJS version of the Neo4j client
const neo4j = require('neo4j-driver');
// Use dotenv in a safer way that works with Next.js
const dotenv = require('dotenv');
// Initialize dotenv only in server environments
if (typeof process !== 'undefined') {
  dotenv.config();
}

// Use environment variables for Neo4j connection
const uri = process.env.NEO4J_URI || 'bolt://localhost:7687';
const username = process.env.NEO4J_USERNAME || 'neo4j';
const password = process.env.NEO4J_PASSWORD || 'password';

// Log connection details in development
if (process.env.NODE_ENV !== 'production') {
  console.log('Neo4j connection uri:', uri);
}

// Create Neo4j driver instance
const driver = neo4j.driver(
  uri, 
  neo4j.auth.basic(username, password),
  {
    maxConnectionPoolSize: 50,
    connectionAcquisitionTimeout: 30000,
    // Logging can be turned off in production
    logging: {
      level: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
      logger: (level, message) => console.log(`[Neo4j/${level}] ${message}`)
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
    console.error('Database error:', error);
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
    console.error('Failed to connect to Neo4j:', error);
    return false;
  } finally {
    await session.close();
  }
}

module.exports = { driver, executeQuery, verifyConnection };