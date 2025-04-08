// CommonJS version of the Neo4j client
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
      logger: (level, message) => logger.log(`[Neo4j/${level}] ${message}`)
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

module.exports = { driver, executeQuery, verifyConnection };