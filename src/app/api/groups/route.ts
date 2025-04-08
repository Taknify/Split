import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/neo4j';
import { auth } from '@/lib/auth/auth';

// Get all groups for the current user
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

    // Query Neo4j for all groups the user is a member of
    const cypher = `
      MATCH (u:User {id: $userId})-[:MEMBER_OF]->(g:Group)
      OPTIONAL MATCH (g)<-[:MEMBER_OF]-(member:User)
      OPTIONAL MATCH (g)<-[:BELONGS_TO]-(e:Expense)
      WITH g, count(distinct member) as memberCount, 
           sum(e.amount) as totalExpenses,
           collect(distinct member) as members
      RETURN g.id as id, g.name as name, g.image as image, g.createdAt as createdAt,
             toInteger(memberCount) as memberCount, toFloat(totalExpenses) as totalExpenses,
             [m in members | {id: m.id, name: m.name, email: m.email}] as memberList
    `;

    const groups = await executeQuery(cypher, { userId });

    return NextResponse.json(groups);
  } catch (error) {
    console.error('Error fetching groups:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: (error as Error).message },
      { status: 500 }
    );
  }
}