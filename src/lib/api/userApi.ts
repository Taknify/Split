/**
 * API functions for user management
 * To be used by the admin dashboard
 */
import { executeQuery } from '../neo4j';

// Get all users
export async function getAllUsers() {
  try {
    const result = await executeQuery(`
      MATCH (u:User)
      OPTIONAL MATCH (u)-[:MEMBER_OF]->(g:Group)
      RETURN u.id as id, u.name as name, u.email as email, 
             u.createdAt as createdAt, count(g) as groupCount,
             CASE WHEN u.isAdmin = true THEN true ELSE false END as isAdmin
      ORDER BY u.createdAt DESC
    `);
    
    return result.map(record => ({
      id: record.id,
      name: record.name,
      email: record.email,
      createdAt: record.createdAt,
      groupCount: record.groupCount.low || 0, // Neo4j returns some numbers as Int objects
      isAdmin: record.isAdmin
    }));
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
}

// Get user by ID
export async function getUserById(id: string) {
  try {
    const result = await executeQuery(`
      MATCH (u:User {id: $id})
      OPTIONAL MATCH (u)-[:MEMBER_OF]->(g:Group)
      RETURN u.id as id, u.name as name, u.email as email, 
             u.createdAt as createdAt, collect(g.name) as groups,
             CASE WHEN u.isAdmin = true THEN true ELSE false END as isAdmin
    `, { id });
    
    if (result.length === 0) {
      return null;
    }
    
    const user = result[0];
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      groups: user.groups || [],
      isAdmin: user.isAdmin
    };
  } catch (error) {
    console.error('Error getting user by ID:', error);
    throw error;
  }
}

// Delete user
export async function deleteUser(id: string) {
  try {
    // First check if user is an admin
    const adminCheck = await executeQuery(`
      MATCH (u:User {id: $id})
      RETURN u.isAdmin as isAdmin
    `, { id });
    
    if (adminCheck.length > 0 && adminCheck[0].isAdmin) {
      throw new Error('Cannot delete admin user');
    }
    
    // Delete the user and all their relationships
    const result = await executeQuery(`
      MATCH (u:User {id: $id})
      OPTIONAL MATCH (u)-[r]-()
      DELETE r, u
      RETURN count(u) as deletedCount
    `, { id });
    
    return result[0].deletedCount > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
}

// Get system statistics
export async function getSystemStats() {
  try {
    const userStats = await executeQuery(`
      MATCH (u:User)
      RETURN count(u) as totalUsers,
             sum(CASE WHEN u.createdAt > datetime() - duration('P7D') THEN 1 ELSE 0 END) as newUsersThisWeek
    `);
    
    const groupStats = await executeQuery(`
      MATCH (g:Group)
      RETURN count(g) as totalGroups
    `);
    
    const expenseStats = await executeQuery(`
      MATCH (e:Expense)
      RETURN count(e) as totalExpenses,
             sum(e.amount) as totalAmount
    `);
    
    return {
      totalUsers: userStats[0].totalUsers.low || 0,
      newUsersThisWeek: userStats[0].newUsersThisWeek.low || 0,
      totalGroups: groupStats[0].totalGroups.low || 0,
      totalExpenses: expenseStats[0].totalExpenses.low || 0,
      totalAmount: expenseStats[0].totalAmount || 0
    };
  } catch (error) {
    console.error('Error getting system stats:', error);
    throw error;
  }
}