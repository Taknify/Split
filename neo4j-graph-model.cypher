// Neo4j Cypher script for creating our graph data model for SplitApp

// Clear existing data (be careful with this in production!)
MATCH (n) DETACH DELETE n;

// Create User nodes
CREATE (admin:User {
  id: "user-1",
  name: "Admin User",
  email: "adharbhattarai@gmail.com",
  password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9l0lzXO", // Hashed "password"
  isAdmin: true,
  createdAt: datetime("2025-04-01T00:00:00Z")
})

CREATE (regularUser:User {
  id: "user-2",
  name: "Regular User",
  email: "user@example.com",
  password: "$2a$10$hACwQ5/HQI6FhbIISOUVeusy3sKyUDhSq36fF5d/54aULe9l0lzXO", // Hashed "password"
  isAdmin: false,
  createdAt: datetime("2025-04-02T00:00:00Z")
})

// Create Group nodes
CREATE (teamLunch:Group {
  id: "group-1",
  name: "Weekly Team Lunch",
  description: "Our weekly team lunch expense group",
  createdAt: datetime("2025-04-03T00:00:00Z")
})

CREATE (dinnerGroup:Group {
  id: "group-2",
  name: "Dinner at Restaurant",
  description: "Fancy dinner at the new downtown restaurant",
  createdAt: datetime("2025-04-07T00:00:00Z"),
  status: "ongoing"
})

// Create Expense node
CREATE (lunchExpense:Expense {
  id: "expense-1",
  description: "Team Lunch at Restaurant",
  amount: 100.00,
  currency: "USD",
  date: datetime("2025-04-05T12:30:00Z")
})

// Create relationships between Users and Groups
CREATE (admin)-[:MEMBER_OF {role: "admin", joinedAt: datetime("2025-04-03T00:00:00Z")}]->(teamLunch)
CREATE (regularUser)-[:MEMBER_OF {role: "member", joinedAt: datetime("2025-04-03T00:00:00Z")}]->(teamLunch)

// Add both users to the dinner group
CREATE (admin)-[:MEMBER_OF {role: "member", joinedAt: datetime("2025-04-07T00:00:00Z")}]->(dinnerGroup)
CREATE (regularUser)-[:MEMBER_OF {role: "admin", joinedAt: datetime("2025-04-07T00:00:00Z")}]->(dinnerGroup)

// Create relationship between Admin and Expense (Admin paid)
CREATE (admin)-[:PAID {date: datetime("2025-04-05T12:35:00Z")}]->(lunchExpense)

// Create relationship between Expense and Group
CREATE (lunchExpense)-[:BELONGS_TO]->(teamLunch)

// Create Shares for the expense (showing the 50/50 split)
CREATE (adminShare:Share {
  id: "share-1",
  amount: 50.00,
  percentage: 50,
  status: "paid"
})

CREATE (regularUserShare:Share {
  id: "share-2",
  amount: 50.00,
  percentage: 50,
  status: "pending"
})

// Connect Shares to Expense
CREATE (lunchExpense)-[:HAS_SHARE]->(adminShare)
CREATE (lunchExpense)-[:HAS_SHARE]->(regularUserShare)

// Connect Shares to Users
CREATE (adminShare)-[:ASSIGNED_TO]->(admin)
CREATE (regularUserShare)-[:ASSIGNED_TO]->(regularUser)

// Create Virtual Card
CREATE (teamCard:VirtualCard {
  id: "card-1",
  name: "Team Lunch Card",
  lastFour: "5555",
  expiryMonth: 4,
  expiryYear: 26,
  limit: 100.00,
  spent: 50.00,
  active: true,
  createdAt: datetime("2025-04-04T00:00:00Z")
})

// Connect Card to Group
CREATE (teamLunch)-[:HAS_CARD]->(teamCard)

// Verify our data model
MATCH (n) RETURN n LIMIT 25;

// Query to show the expense split between users
MATCH (u:User)<-[:ASSIGNED_TO]-(s:Share)<-[:HAS_SHARE]-(e:Expense)-[:BELONGS_TO]->(g:Group)
WHERE g.name = "Weekly Team Lunch"
RETURN u.name AS User, s.amount AS Share, (s.status = "paid") AS IsPaid, e.description AS Expense, e.amount AS TotalAmount;