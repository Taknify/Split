import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/neo4j';
import { auth } from '@/lib/auth/auth';

// Get all expenses for the current user
export async function GET(request: NextRequest) {
  try {
    // Get current user from session
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Query Neo4j for all expenses related to the user
    const cypher = `
      MATCH (u:User {id: $userId})-[:MEMBER_OF]->(g:Group)<-[:BELONGS_TO]-(e:Expense)
      MATCH (paidBy:User)-[:PAID_FOR]->(e)
      WITH e, g, paidBy, 
           (e.amount / size((g)<-[:MEMBER_OF]-(:User))) as individualShare
      RETURN e.id as id, e.description as description, toFloat(e.amount) as amount, 
             e.date as date, g.id as groupId, g.name as groupName,
             paidBy.id as paidById, paidBy.name as paidByName,
             toFloat(individualShare) as yourShare,
             paidBy.id = $userId as paidByYou
      ORDER BY e.date DESC
    `;

    const expenses = await executeQuery(cypher, { userId });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error fetching expenses:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}