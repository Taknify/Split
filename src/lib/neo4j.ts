// TypeScript version of the Neo4j client
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
      logger: (level: string, message: string) => logger.log(`[Neo4j/${level}] ${message}`)
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
        const value = record.get(key);
        // Handle Neo4j Integer values by converting them to regular JavaScript numbers
        if (value !== null && typeof value === 'object' && 'low' in value && 'high' in value) {
          resultObj[key] = neo4j.integer.toNumber(value);
        } else {
          resultObj[key] = value;
        }
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
}