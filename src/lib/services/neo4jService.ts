// src/lib/services/neo4jService.ts

import { driver as neo4jDriver, executeQuery } from '@/lib/neo4j';

/**
 * Fetch all dashboard data for a user by email
 */
export async function fetchUserDashboardData(userEmail: string) {
  const session = neo4jDriver.session();
  
  try {
    // Get user information
    const userResult = await session.run(`
      MATCH (u:User {email: $userEmail})
      RETURN u
    `, { userEmail });
    
    if (userResult.records.length === 0) {
      throw new Error(`User not found: ${userEmail}`);
    }
    
    const user = userResult.records[0].get('u').properties;
    
    // Get user's groups
    const groupsResult = await session.run(`
      MATCH (u:User {email: $userEmail})-[:MEMBER_OF]->(g:Group)
      RETURN g
    `, { userEmail });
    
    const groups = groupsResult.records.map(record => {
      const group = record.get('g').properties;
      return {
        id: group.id || record.get('g').identity.toString(),
        name: group.name,
        members: group.members || 0,
        totalExpenses: group.totalExpenses || 0,
        yourShare: group.yourShare || 0,
        status: group.status,
        image: group.image || ''
      };
    });
    
    // Get user's recent expenses
    const expensesResult = await session.run(`
      MATCH (u:User {email: $userEmail})-[r:INVOLVED_IN]->(e:Expense)
      RETURN e, r.share as yourShare
      ORDER BY e.date DESC
      LIMIT 5
    `, { userEmail });
    
    const recentExpenses = expensesResult.records.map(record => {
      const expense = record.get('e').properties;
      return {
        id: expense.id || record.get('e').identity.toString(),
        description: expense.description,
        group: expense.group,
        amount: expense.amount,
        date: formatDate(expense.date),
        paidBy: expense.paidBy,
        yourShare: record.get('yourShare') || 0
      };
    });
    
    // Get user's virtual cards
    const cardsResult = await session.run(`
      MATCH (u:User {email: $userEmail})-[:CREATED]->(c:Card)
      RETURN c
    `, { userEmail });
    
    const cards = cardsResult.records.map(record => {
      const card = record.get('c').properties;
      return {
        id: card.id || record.get('c').identity.toString(),
        name: card.name,
        number: card.number,
        expiry: card.expiry,
        available: card.available,
        spent: card.spent,
        color: card.color || 'indigo'
      };
    });
    
    // Get user's payment methods
    const paymentMethodsResult = await session.run(`
      MATCH (u:User {email: $userEmail})-[:HAS_PAYMENT_METHOD]->(p:PaymentMethod)
      RETURN p
      ORDER BY p.isDefault DESC
    `, { userEmail });
    
    const paymentMethods = paymentMethodsResult.records.map(record => {
      const method = record.get('p').properties;
      return {
        id: method.id,
        type: method.type,
        last4: method.last4,
        expiry: method.expiry,
        name: method.name,
        isDefault: method.isDefault
      };
    });
    
    // Get funding requests for user's groups
    const fundingRequestsResult = await session.run(`
      MATCH (u:User {email: $userEmail})-[:MEMBER_OF]->(g:Group)-[:HAS_FUNDING_REQUEST]->(f:FundingRequest)
      WHERE f.status = 'pending'
      RETURN f
    `, { userEmail });
    
    const fundingRequests = fundingRequestsResult.records.map(record => {
      const request = record.get('f').properties;
      return {
        id: request.id || record.get('f').identity.toString(),
        groupName: request.groupName,
        amount: request.amount,
        dueDate: formatDate(request.dueDate),
        status: request.status
      };
    });
    
    // Calculate balances
    const balancesResult = await session.run(`
      MATCH (u:User {email: $userEmail})-[r:INVOLVED_IN]->(e:Expense)
      RETURN 
        sum(CASE WHEN e.paidBy <> $name THEN r.share ELSE 0 END) as youOwe,
        sum(CASE WHEN e.paidBy = $name THEN e.amount - r.share ELSE 0 END) as owedToYou
    `, { 
      userEmail, 
      name: user.name 
    });
    
    let youOwe = 0;
    let owedToYou = 0;
    
    if (balancesResult.records.length > 0) {
      youOwe = balancesResult.records[0].get('youOwe') || 0;
      owedToYou = balancesResult.records[0].get('owedToYou') || 0;
    }
    
    // Return complete dashboard data
    return {
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      },
      groups,
      recentExpenses,
      cards,
      balances: {
        youOwe,
        owedToYou,
        netBalance: owedToYou - youOwe
      },
      paymentMethods,
      fundingRequests
    };
  } finally {
    await session.close();
  }
}

// Helper function to format Neo4j date objects
function formatDate(neoDate: any): string {
  if (!neoDate) return '';
  
  try {
    // Handle different Neo4j date formats
    if (typeof neoDate === 'string') {
      return new Date(neoDate).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
    
    if (neoDate.year && neoDate.month && neoDate.day) {
      return new Date(neoDate.year.low, neoDate.month.low - 1, neoDate.day.low).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    }
    
    return '';
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  try {
    const result = await executeQuery(
      'MATCH (u:User {email: $email}) RETURN u',
      { email }
    );
    
    if (result.length === 0) {
      return null;
    }
    
    return result[0].u;
  } catch (error) {
    console.error('Error fetching user by email:', error);
    throw error;
  }
}

/**
 * Get dashboard summary data for a user
 */
export async function getDashboardSummary(userId: string) {
  const session = neo4jDriver.session();
  
  try {
    // Get user's groups
    const groupsResult = await session.run(`
      MATCH (u:User {id: $userId})-[:MEMBER_OF]->(g:Group)
      RETURN g
      LIMIT 5
    `, { userId });
    
    const groups = groupsResult.records.map(record => {
      const group = record.get('g').properties;
      return {
        id: group.id,
        name: group.name,
        description: group.description || '',
        members: group.members || 0,
        createdAt: formatDate(group.createdAt)
      };
    });
    
    // Get user's recent expenses
    const expensesResult = await session.run(`
      MATCH (u:User {id: $userId})-[:PAID_FOR]->(e:Expense)
      RETURN e
      ORDER BY e.date DESC
      LIMIT 5
    `, { userId });
    
    const expenses = expensesResult.records.map(record => {
      const expense = record.get('e').properties;
      return {
        id: expense.id,
        description: expense.description,
        amount: expense.amount,
        date: formatDate(expense.date),
        currency: expense.currency || 'USD'
      };
    });
    
    // Get user's virtual cards
    const cardsResult = await session.run(`
      MATCH (g:Group)-[:HAS_CARD]->(c:VirtualCard)
      WHERE (g)<-[:MEMBER_OF]-(:User {id: $userId})
      RETURN c
      LIMIT 5
    `, { userId });
    
    const cards = cardsResult.records.map(record => {
      const card = record.get('c').properties;
      return {
        id: card.id,
        name: card.name,
        lastFour: card.lastFour,
        expiryMonth: card.expiryMonth,
        expiryYear: card.expiryYear,
        initialBalance: card.initialBalance,
        spent: card.spent
      };
    });
    
    return {
      groups,
      expenses,
      cards
    };
  } finally {
    await session.close();
  }
}
