import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/neo4j';
import { auth } from '@/lib/auth/auth';

// Get all virtual cards for the current user
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

    // Query Neo4j for all virtual cards related to the user's groups
    const cypher = `
      MATCH (u:User {id: $userId})-[:MEMBER_OF]->(g:Group)-[:HAS_CARD]->(c:VirtualCard)
      OPTIONAL MATCH (g)<-[:MEMBER_OF]-(member:User)
      OPTIONAL MATCH (member)-[:FUNDED]->(f:Funding)-[:FUNDS]->(c)
      WITH c, g, count(distinct member) as totalMembers, count(distinct f) as fundedMembers,
           sum(f.amount) as totalFunded, c.initialBalance - sum(coalesce(c.spent, 0)) as balance
      RETURN c.id as id, c.name as name, c.number as number, 
             toString(c.expiryMonth) + '/' + toString(c.expiryYear) as expiry,
             c.initialBalance as initialBalance, coalesce(c.spent, 0) as spent,
             g.id as groupId, g.name as groupName,
             totalMembers, fundedMembers, totalFunded, balance
    `;

    const cards = await executeQuery(cypher, { userId });

    return NextResponse.json(cards);
  } catch (error) {
    console.error('Error fetching virtual cards:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}