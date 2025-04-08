import { executeQuery, verifyConnection } from '../neo4j';
import bcrypt from 'bcryptjs';

/**
 * Initialize the database with schema constraints and sample data
 */
export async function initializeDatabase() {
  try {
    // Test connection
    const isConnected = await verifyConnection();
    if (!isConnected) {
      console.error('Failed to connect to Neo4j database');
      return false;
    }
    
    console.log('Connected to Neo4j successfully');
    
    // Create constraints
    await createConstraints();
    
    // Create test data
    await createTestData();
    
    console.log('Database initialized successfully');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
}

/**
 * Create database constraints
 */
async function createConstraints() {
  // Create constraint on User.id (unique)
  try {
    await executeQuery(`
      CREATE CONSTRAINT user_id_unique IF NOT EXISTS
      FOR (u:User) REQUIRE u.id IS UNIQUE
    `);
    
    // Create constraint on User.email (unique)
    await executeQuery(`
      CREATE CONSTRAINT user_email_unique IF NOT EXISTS
      FOR (u:User) REQUIRE u.email IS UNIQUE
    `);
    
    console.log('Database constraints created');
  } catch (error) {
    console.error('Error creating constraints:', error);
    throw error;
  }
}

/**
 * Create test data in the database
 */
async function createTestData() {
  try {
    // Check if test user already exists
    const existingUser = await executeQuery(
      'MATCH (u:User {email: $email}) RETURN u',
      { email: 'test@example.com' }
    );
    
    if (existingUser.length === 0) {
      // Create a test user
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);
      
      await executeQuery(`
        CREATE (u:User {
          id: randomUUID(),
          name: $name,
          email: $email,
          password: $password,
          createdAt: datetime()
        })
        RETURN u
      `, {
        name: 'Test User',
        email: 'test@example.com',
        password: hashedPassword
      });
      
      console.log('Test user created');
    } else {
      console.log('Test user already exists');
    }
  } catch (error) {
    console.error('Error creating test data:', error);
    throw error;
  }
}