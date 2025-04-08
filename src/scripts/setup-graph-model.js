// Script to set up graph model with user relationships
require('dotenv').config({ path: process.cwd() + '/.env.local' });
const neo4j = require('neo4j-driver');

async function setupGraphModel() {
  // Get connection details
  const uri = process.env.NEO4J_URI;
  const username = process.env.NEO4J_USERNAME;
  const password = process.env.NEO4J_PASSWORD;
  
  console.log('Using connection details:');
  console.log('URI:', uri);
  console.log('Username:', username);
  console.log('Password:', password ? 'Provided' : 'Not provided');
  
  // Create driver
  const driver = neo4j.driver(
    uri,
    neo4j.auth.basic(username, password)
  );
  
  const session = driver.session({ database: 'neo4j' });
  
  try {
    console.log('Setting up graph model with constraints and indexes...');
    
    // Create constraints for unique node identifiers
    const constraints = [
      {
        name: 'user_id_unique',
        query: 'CREATE CONSTRAINT user_id_unique IF NOT EXISTS FOR (u:User) REQUIRE u.id IS UNIQUE'
      },
      {
        name: 'user_email_unique',
        query: 'CREATE CONSTRAINT user_email_unique IF NOT EXISTS FOR (u:User) REQUIRE u.email IS UNIQUE'
      },
      {
        name: 'group_id_unique',
        query: 'CREATE CONSTRAINT group_id_unique IF NOT EXISTS FOR (g:Group) REQUIRE g.id IS UNIQUE'
      },
      {
        name: 'expense_id_unique',
        query: 'CREATE CONSTRAINT expense_id_unique IF NOT EXISTS FOR (e:Expense) REQUIRE e.id IS UNIQUE'
      },
      {
        name: 'card_id_unique',
        query: 'CREATE CONSTRAINT card_id_unique IF NOT EXISTS FOR (c:Card) REQUIRE c.id IS UNIQUE'
      }
    ];
    
    // Execute all constraints
    for (const constraint of constraints) {
      try {
        await session.run(constraint.query);
        console.log(`✅ Created constraint: ${constraint.name}`);
      } catch (error) {
        console.error(`❌ Error creating constraint ${constraint.name}:`, error.message);
      }
    }
    
    // Create indexes for better query performance
    const indexes = [
      {
        name: 'user_name_index',
        query: 'CREATE INDEX user_name_index IF NOT EXISTS FOR (u:User) ON (u.name)'
      },
      {
        name: 'group_name_index',
        query: 'CREATE INDEX group_name_index IF NOT EXISTS FOR (g:Group) ON (g.name)'
      },
      {
        name: 'expense_date_index',
        query: 'CREATE INDEX expense_date_index IF NOT EXISTS FOR (e:Expense) ON (e.date)'
      }
    ];
    
    // Execute all indexes
    for (const index of indexes) {
      try {
        await session.run(index.query);
        console.log(`✅ Created index: ${index.name}`);
      } catch (error) {
        console.error(`❌ Error creating index ${index.name}:`, error.message);
      }
    }
    
    // Create sample data
    console.log('\nCreating sample data for graph model...');
    
    // Check existing users
    const existingUsersResult = await session.run('MATCH (u:User) RETURN u.email as email');
    const existingEmails = existingUsersResult.records.map(record => record.get('email'));
    console.log('Existing users:', existingEmails);
    
    // Create sample users if they don't exist
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);
    
    const sampleUsers = [
      { name: 'Test User', email: 'test@example.com', password: hashedPassword },
      { name: 'Alice Johnson', email: 'alice@example.com', password: hashedPassword },
      { name: 'Bob Smith', email: 'bob@example.com', password: hashedPassword },
      { name: 'Charlie Brown', email: 'charlie@example.com', password: hashedPassword }
    ];
    
    for (const user of sampleUsers) {
      if (!existingEmails.includes(user.email)) {
        try {
          await session.run(`
            CREATE (u:User {
              id: randomUUID(),
              name: $name,
              email: $email,
              password: $password,
              createdAt: datetime()
            })
            RETURN u
          `, user);
          console.log(`✅ Created user: ${user.name} (${user.email})`);
        } catch (error) {
          console.error(`❌ Error creating user ${user.email}:`, error.message);
        }
      } else {
        console.log(`ℹ️ User ${user.email} already exists, skipping`);
      }
    }
    
    // Create a sample expense group
    console.log('\nCreating sample expense group...');
    try {
      // First see if a group already exists
      const existingGroupResult = await session.run('MATCH (g:Group {name: "Vacation Trip"}) RETURN g');
      
      if (existingGroupResult.records.length === 0) {
        const createGroupResult = await session.run(`
          CREATE (g:Group {
            id: randomUUID(),
            name: "Vacation Trip",
            description: "Group expenses for our summer vacation",
            createdAt: datetime()
          })
          RETURN g.id as id
        `);
        
        const groupId = createGroupResult.records[0].get('id');
        console.log(`✅ Created group: Vacation Trip (${groupId})`);
        
        // Add users to the group
        const usersResult = await session.run('MATCH (u:User) RETURN u.id as id, u.name as name LIMIT 4');
        const users = usersResult.records.map(record => ({
          id: record.get('id'),
          name: record.get('name')
        }));
        
        // Create relationships between users and group
        for (const user of users) {
          await session.run(`
            MATCH (u:User {id: $userId}), (g:Group {id: $groupId})
            CREATE (u)-[:MEMBER_OF {joinedAt: datetime(), isAdmin: $isAdmin}]->(g)
          `, {
            userId: user.id,
            groupId: groupId,
            isAdmin: user.name === 'Test User' // Make test user the admin
          });
          console.log(`✅ Added ${user.name} to Vacation Trip group`);
        }
        
        // Create sample expenses
        const expenses = [
          { 
            description: "Hotel Booking", 
            amount: 650.00, 
            paidBy: users[0].id,
            date: "2023-07-15"
          },
          { 
            description: "Dinner at Seafood Restaurant", 
            amount: 125.50, 
            paidBy: users[1].id,
            date: "2023-07-16" 
          },
          { 
            description: "Rental Car", 
            amount: 200.00, 
            paidBy: users[2].id,
            date: "2023-07-17" 
          }
        ];
        
        for (const expense of expenses) {
          // Create expense node
          const expenseResult = await session.run(`
            MATCH (g:Group {id: $groupId})
            CREATE (e:Expense {
              id: randomUUID(),
              description: $description,
              amount: $amount,
              date: date($date),
              createdAt: datetime()
            })-[:BELONGS_TO]->(g)
            RETURN e.id as id
          `, {
            groupId: groupId,
            description: expense.description,
            amount: expense.amount,
            date: expense.date
          });
          
          const expenseId = expenseResult.records[0].get('id');
          console.log(`✅ Created expense: ${expense.description} ($${expense.amount})`);
          
          // Connect who paid the expense
          await session.run(`
            MATCH (u:User {id: $userId}), (e:Expense {id: $expenseId})
            CREATE (u)-[:PAID {date: date($date)}]->(e)
          `, {
            userId: expense.paidBy,
            expenseId: expenseId,
            date: expense.date
          });
          
          // Create split relationships for all group members
          const splitAmount = expense.amount / users.length;
          
          for (const user of users) {
            await session.run(`
              MATCH (u:User {id: $userId}), (e:Expense {id: $expenseId})
              CREATE (u)-[:OWES {
                amount: $amount,
                isPaid: $isPaid,
                settledAt: $settledAt
              }]->(e)
            `, {
              userId: user.id,
              expenseId: expenseId,
              amount: splitAmount,
              isPaid: user.id === expense.paidBy, // Paid by default if this user paid
              settledAt: user.id === expense.paidBy ? Date.now() : null
            });
          }
        }
        
        // Create a virtual card for the group
        const cardResult = await session.run(`
          MATCH (g:Group {id: $groupId})
          CREATE (c:Card {
            id: randomUUID(),
            cardNumber: "4111 XXXX XXXX 1111",
            expiryDate: "07/25",
            cvv: "***",
            cardholderName: "VACATION GROUP",
            createdAt: datetime(),
            isActive: true,
            isVirtual: true
          })-[:LINKED_TO]->(g)
          RETURN c.id as id
        `, { groupId: groupId });
        
        const cardId = cardResult.records[0].get('id');
        console.log(`✅ Created virtual card for group (${cardId})`);
      } else {
        console.log('ℹ️ Vacation Trip group already exists, skipping group creation');
      }
    } catch (error) {
      console.error('❌ Error setting up group data:', error.message);
    }
    
    console.log('\nGraph model setup complete!');
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await session.close();
    await driver.close();
  }
}

// Run the function
setupGraphModel()
  .then(() => console.log('\nAll tasks completed!'))
  .catch(err => console.error('Script failed:', err));