// Neo4j Cypher script to update graph data model for "Dinner at Restaurant" flow

// 1. Create dinner expense
MATCH (dinnerGroup:Group {name: "Dinner at Restaurant"})
MATCH (admin:User {email: "adharbhattarai@gmail.com"})
MATCH (regularUser:User {email: "user@example.com"})

// Create new expense for dinner
CREATE (dinnerExpense:Expense {
  id: "expense-2",
  description: "Dinner at Restaurant",
  amount: 100.00,
  currency: "USD",
  date: datetime("2025-04-07T19:00:00Z"),
  status: "created"
})

// Link expense to group
CREATE (dinnerExpense)-[:BELONGS_TO]->(dinnerGroup)

// 2. Create shares for the 50/50 split
CREATE (adminDinnerShare:Share {
  id: "share-3",
  amount: 50.00,
  percentage: 50,
  status: "pending"
})

CREATE (regularUserDinnerShare:Share {
  id: "share-4",
  amount: 50.00,
  percentage: 50,
  status: "pending"
})

// Connect shares to expense
CREATE (dinnerExpense)-[:HAS_SHARE]->(adminDinnerShare)
CREATE (dinnerExpense)-[:HAS_SHARE]->(regularUserDinnerShare)

// Connect shares to users
CREATE (adminDinnerShare)-[:ASSIGNED_TO]->(admin)
CREATE (regularUserDinnerShare)-[:ASSIGNED_TO]->(regularUser)

// 3. Create payment methods
CREATE (adminVisaCard:PaymentMethod {
  id: "pm-1",
  type: "visa",
  last4: "4242",
  expiryMonth: 4,
  expiryYear: 25,
  name: "Personal Visa",
  isDefault: true
})

CREATE (adminMasterCard:PaymentMethod {
  id: "pm-2", 
  type: "mastercard",
  last4: "5555",
  expiryMonth: 5, 
  expiryYear: 26,
  name: "Work Mastercard",
  isDefault: false
})

// Link payment methods to admin user
CREATE (admin)-[:HAS_PAYMENT_METHOD]->(adminVisaCard)
CREATE (admin)-[:HAS_PAYMENT_METHOD]->(adminMasterCard)

// 4. Create funding request
CREATE (fundingRequest:FundingRequest {
  id: "fr-1",
  amount: 75.00,
  dueDate: datetime("2025-04-08T00:00:00Z"),
  status: "pending",
  createdAt: datetime("2025-04-07T19:15:00Z")
})

// Link funding request to group
CREATE (dinnerGroup)-[:HAS_FUNDING_REQUEST]->(fundingRequest)

// 5. Create virtual card (that will be funded)
CREATE (dinnerCard:VirtualCard {
  id: "card-2",
  name: "Dinner at Restaurant Card",
  lastFour: "9076",
  expiryMonth: 4,
  expiryYear: 26,
  limit: 100.00,
  spent: 0.00,
  active: false,
  status: "awaiting_funding",
  merchantRestriction: "Restaurant",
  isOneTimeUse: true,
  createdAt: datetime("2025-04-07T19:30:00Z")
})

// Connect card to group
CREATE (dinnerGroup)-[:HAS_CARD]->(dinnerCard)

// Connect card to expense
CREATE (dinnerExpense)-[:FUNDED_BY]->(dinnerCard)

// 6. Create UI flow relationships
CREATE (dashboardPage:Page {name: "Dashboard"})
CREATE (createBillPage:Page {name: "Create Bill"})
CREATE (createVirtualCardPage:Page {name: "Create Virtual Card"})
CREATE (virtualCardDetailsPage:Page {name: "Virtual Card Details"})

// Connect pages in sequence
CREATE (dashboardPage)-[:LINKS_TO {element: "Details Button", group: "Dinner at Restaurant"}]->(createBillPage)
CREATE (dashboardPage)-[:LINKS_TO {element: "Fund Card Button", group: "Dinner at Restaurant"}]->(createVirtualCardPage)
CREATE (dashboardPage)-[:LINKS_TO {element: "Pay Now Button", group: "Dinner at Restaurant"}]->(createVirtualCardPage)
CREATE (createBillPage)-[:LINKS_TO {element: "Save & Create Virtual Card Button"}]->(createVirtualCardPage)
CREATE (createVirtualCardPage)-[:LINKS_TO {element: "Fund & Create Virtual Card Button"}]->(virtualCardDetailsPage)
CREATE (virtualCardDetailsPage)-[:LINKS_TO {element: "Back to Dashboard Button"}]->(dashboardPage)

// 7. Create entity relationships for the app flow
CREATE (dashboardPage)-[:DISPLAYS]->(dinnerGroup)
CREATE (dashboardPage)-[:DISPLAYS]->(fundingRequest)
CREATE (createBillPage)-[:DISPLAYS]->(dinnerExpense)
CREATE (createBillPage)-[:DISPLAYS]->(adminDinnerShare)
CREATE (createBillPage)-[:DISPLAYS]->(regularUserDinnerShare)
CREATE (createVirtualCardPage)-[:DISPLAYS]->(adminVisaCard)
CREATE (createVirtualCardPage)-[:DISPLAYS]->(adminMasterCard)
CREATE (createVirtualCardPage)-[:DISPLAYS]->(dinnerCard)
CREATE (virtualCardDetailsPage)-[:DISPLAYS]->(dinnerCard)

// Query to show the new flow
MATCH path = (p1:Page)-[:LINKS_TO]->(p2:Page)
RETURN path AS FlowSequence;

// Query to show the expense split between users for the dinner
MATCH (u:User)<-[:ASSIGNED_TO]-(s:Share)<-[:HAS_SHARE]-(e:Expense)-[:BELONGS_TO]->(g:Group)
WHERE g.name = "Dinner at Restaurant"
RETURN u.name AS User, s.amount AS Share, s.status AS Status, e.description AS Expense, e.amount AS TotalAmount;

// Query to show the virtual card details
MATCH (card:VirtualCard)<-[:HAS_CARD]-(g:Group {name: "Dinner at Restaurant"})
RETURN card;