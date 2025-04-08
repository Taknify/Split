import { NextRequest, NextResponse } from 'next/server';
import { getSystemStats } from '@/lib/api/userApi';
import { auth } from '@/lib/auth/auth';

// GET handler - Get system statistics
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await auth();
    if (!session || session.user?.email !== 'test@example.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const stats = await getSystemStats();
    return NextResponse.json({ stats });
  } catch (error) {
    console.error('Error in GET /api/admin/stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch system statistics' }, 
      { status: 500 }
    );
  }
}