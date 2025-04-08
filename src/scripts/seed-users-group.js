// Initialize Neo4j database with 2 users in a group with a bill
require('dotenv').config({ path: process.cwd() + '/.env.local' });
const neo4j = require('neo4j-driver');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

async function initDatabase() {
  // Neo4j connection details from environment variables
  const uri = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;
  
  console.log('Neo4j Connection Details:');
  console.log('URI:', uri);
  console.log('Username:', username);
  console.log('Password:', password ? 'Provided' : 'Not provided');
  
  if (!uri || !username || !password) {
    console.error('Missing Neo4j connection details in .env.local');
    process.exit(1);
  }
  
  // Create Neo4j driver
  const driver = neo4j.driver(
    uri,
    neo4j.auth.basic(username, password),
    {
      maxConnectionPoolSize: 50,
      connectionAcquisitionTimeout: 30000,
      logging: {
        level: 'info',
        logger: (level, message) => console.log(`[Neo4j/${level}] ${message}`)
      }
    }
  );
  
  const session = driver.session();
  
  try {
    console.log('Initializing Neo4j database with test data...');
    
    // Clear existing data
    await session.run(`
      MATCH (n)
      DETACH DELETE n
    `);
    console.log('Database cleared');
    
    // Hash password once for both users
    const passwordHash = await bcrypt.hash('password123', 10);
    
    // Create user 1 (Admin)
    const user1Result = await session.run(`
      CREATE (u:User {
        id: randomUUID(),
        name: "Adhar Bhattarai",
        email: "adharbhattarai@gmail.com",
        password: $passwordHash,
        isAdmin: true,
        createdAt: datetime()
      })
      RETURN u.id as id, u.email as email
    `, { passwordHash });
    
    const user1Id = user1Result.records[0].get('id');
    const user1Email = user1Result.records[0].get('email');
    console.log(`Created user 1: ${user1Email} (${user1Id})`);
    
    // Create user 2
    const user2Result = await session.run(`
      CREATE (u:User {
        id: randomUUID(),
        name: "Test User",
        email: "test@gmail.com",
        password: $passwordHash,
        isAdmin: false,
        createdAt: datetime()
      })
      RETURN u.id as id, u.email as email
    `, { passwordHash });
    
    const user2Id = user2Result.records[0].get('id');
    const user2Email = user2Result.records[0].get('email');
    console.log(`Created user 2: ${user2Email} (${user2Id})`);
    
    // Create a group
    const groupResult = await session.run(`
      CREATE (g:Group {
        id: randomUUID(),
        name: "Dinner Group",
        description: "Regular dinner expenses",
        createdAt: datetime()
      })
      RETURN g.id as id, g.name as name
    `);
    
    const groupId = groupResult.records[0].get('id');
    const groupName = groupResult.records[0].get('name');
    console.log(`Created group: ${groupName} (${groupId})`);
    
    // Add users to the group (John as admin, Jane as member)
    await session.run(`
      MATCH (u:User), (g:Group)
      WHERE u.id = $user1Id AND g.id = $groupId
      CREATE (u)-[:MEMBER_OF {role: "admin", joinedAt: datetime()}]->(g),
             (u)-[:ADMIN_OF]->(g)
    `, { user1Id, groupId });
    
    await session.run(`
      MATCH (u:User), (g:Group)
      WHERE u.id = $user2Id AND g.id = $groupId
      CREATE (u)-[:MEMBER_OF {role: "member", joinedAt: datetime()}]->(g)
    `, { user2Id, groupId });
    
    console.log('Added users to group with proper roles');
    
    // Create an expense (bill)
    const expenseResult = await session.run(`
      CREATE (e:Expense {
        id: randomUUID(),
        description: "Dinner at Italian Restaurant",
        amount: 60.00,
        currency: "USD",
        date: datetime() - duration('P2D'),
        createdAt: datetime()
      })
      RETURN e.id as id, e.description as description, e.amount as amount
    `);
    
    const expenseId = expenseResult.records[0].get('id');
    const expenseDesc = expenseResult.records[0].get('description');
    const expenseAmount = expenseResult.records[0].get('amount');
    console.log(`Created expense: ${expenseDesc} - $${expenseAmount} (${expenseId})`);
    
    // Connect expense to group
    await session.run(`
      MATCH (e:Expense), (g:Group)
      WHERE e.id = $expenseId AND g.id = $groupId
      CREATE (e)-[:BELONGS_TO]->(g)
    `, { expenseId, groupId });
    
    // Mark user 1 (John) as the one who paid
    await session.run(`
      MATCH (u:User), (e:Expense)
      WHERE u.id = $user1Id AND e.id = $expenseId
      CREATE (u)-[:PAID_FOR {date: datetime() - duration('P2D')}]->(e)
    `, { user1Id, expenseId });
    
    // Create shares for the expense (split 50/50)
    const share1Result = await session.run(`
      CREATE (s:Share {
        id: randomUUID(),
        amount: 30.00,
        percentage: 50,
        status: "paid"
      })
      RETURN s.id as id
    `);
    
    const share1Id = share1Result.records[0].get('id');
    
    const share2Result = await session.run(`
      CREATE (s:Share {
        id: randomUUID(),
        amount: 30.00,
        percentage: 50,
        status: "pending"
      })
      RETURN s.id as id
    `);
    
    const share2Id = share2Result.records[0].get('id');
    
    // Connect shares to expense
    await session.run(`
      MATCH (s:Share), (e:Expense)
      WHERE s.id IN [$share1Id, $share2Id] AND e.id = $expenseId
      CREATE (e)-[:HAS_SHARE]->(s)
    `, { share1Id, share2Id, expenseId });
    
    // Assign shares to users
    await session.run(`
      MATCH (s:Share), (u:User)
      WHERE s.id = $share1Id AND u.id = $user1Id
      CREATE (s)-[:ASSIGNED_TO]->(u)
    `, { share1Id, user1Id });
    
    await session.run(`
      MATCH (s:Share), (u:User)
      WHERE s.id = $share2Id AND u.id = $user2Id
      CREATE (s)-[:ASSIGNED_TO]->(u)
    `, { share2Id, user2Id });
    
    console.log('Created and assigned shares for the expense');
    
    // Create a virtual card for the group
    const cardResult = await session.run(`
      CREATE (c:VirtualCard {
        id: randomUUID(),
        name: "Dinner Group Card",
        number: "•••• •••• •••• 4242",
        lastFour: "4242",
        expiryMonth: 12,
        expiryYear: 25,
        initialBalance: 100.00,
        spent: 60.00,
        active: true,
        createdAt: datetime()
      })
      RETURN c.id as id, c.name as name
    `);
    
    const cardId = cardResult.records[0].get('id');
    const cardName = cardResult.records[0].get('name');
    console.log(`Created virtual card: ${cardName} (${cardId})`);
    
    // Link card to group
    await session.run(`
      MATCH (c:VirtualCard), (g:Group)
      WHERE c.id = $cardId AND g.id = $groupId
      CREATE (g)-[:HAS_CARD]->(c)
    `, { cardId, groupId });
    
    console.log('Data initialization complete!');
    
    // Print login information for users
    console.log('\n---------------------------------------------');
    console.log('You can now log in with the following credentials:');
    console.log(`User 1: ${user1Email} / password123 (Admin)`);
    console.log(`User 2: ${user2Email} / password123`);
    console.log('---------------------------------------------\n');
    
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the initialization
initDatabase()
  .then(() => console.log('Database initialization complete.'))
  .catch(error => console.error('Database initialization failed:', error));