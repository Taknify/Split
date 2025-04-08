// Script to create a new database in Neo4j (if needed)
require('dotenv').config({ path: process.cwd() + '/.env.local' });
const neo4j = require('neo4j-driver');

async function createDatabase() {
  // Get connection details
  const uri = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;
  
  console.log('Using connection details:');
  console.log('URI:', uri);
  console.log('Username:', username);
  console.log('Password:', password ? 'Provided' : 'Not provided');
  
  if (!uri || !username || !password) {
    console.error('Missing Neo4j connection details in .env.local');
    process.exit(1);
  }
  
  // Create driver
  const driver = neo4j.driver(
    uri,
    neo4j.auth.basic(username, password)
  );
  
  try {
    // First, let's connect to the system database to list available databases
    const systemSession = driver.session({ database: 'system' });
    
    console.log('Connecting to Neo4j system database...');
    
    try {
      // List available databases
      console.log('Listing available databases:');
      const dbListResult = await systemSession.run('SHOW DATABASES');
      
      // Display all databases
      const databases = dbListResult.records.map(record => {
        return {
          name: record.get('name'),
          address: record.get('address'),
          role: record.get('role'),
          status: record.get('currentStatus')
        };
      });
      
      console.log('Existing databases:');
      databases.forEach(db => {
        console.log(`- ${db.name} (${db.status}) at ${db.address}`);
      });
      
      // Check if our application database exists
      const appDbName = 'splitapp';
      const dbExists = databases.some(db => db.name === appDbName);
      
      if (dbExists) {
        console.log(`Database '${appDbName}' already exists. No need to create it.`);
      } else {
        console.log(`Database '${appDbName}' not found. Attempting to create it...`);
        
        try {
          // Create new database (this may fail on Neo4j Aura which doesn't allow creating new databases)
          await systemSession.run(`CREATE DATABASE ${appDbName} IF NOT EXISTS`);
          console.log(`Database '${appDbName}' created successfully!`);
        } catch (createError) {
          console.error('Error creating database:', createError.message);
          console.log('Note: Neo4j Aura Free tier only allows using the default "neo4j" database.');
          console.log('You can still use the default "neo4j" database for your application.');
        }
      }
      
      // Let's check the default database (neo4j) for user data
      const defaultDbSession = driver.session({ database: 'neo4j' });
      
      // Check if User nodes exist in default database
      const userNodesResult = await defaultDbSession.run('MATCH (u:User) RETURN count(u) as count');
      const userCount = userNodesResult.records[0].get('count').toInt();
      
      console.log(`Found ${userCount} User nodes in default database.`);
      
      if (userCount === 0) {
        console.log('Creating a test user in the default database...');
        
        // Create a test user
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);
        
        await defaultDbSession.run(`
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
        
        console.log('Test user created successfully in default database.');
      }
      
      await defaultDbSession.close();
      
    } catch (error) {
      console.error('Error executing database operations:', error.message);
    } finally {
      await systemSession.close();
    }
    
    // Update the .env.local file with the correct database name
    console.log('\nImportant: Make sure your application is using the correct database.');
    console.log('For Neo4j Aura Free tier, use the default "neo4j" database.');
    console.log('Update your connection string in .env.local if needed.');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await driver.close();
  }
}

// Run the function
createDatabase()
  .then(() => console.log('\nDatabase setup complete'))
  .catch(err => console.error('Script failed:', err));