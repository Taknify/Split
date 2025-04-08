import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, deleteUser } from '@/lib/api/userApi';
import { auth } from '@/lib/auth/auth';

// GET handler - Get all users
export async function GET(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await auth();
    if (!session || session.user?.email !== 'test@example.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const users = await getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error in GET /api/admin/users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' }, 
      { status: 500 }
    );
  }
}

// DELETE handler - Delete a user
export async function DELETE(request: NextRequest) {
  try {
    // Check if user is authenticated and is admin
    const session = await auth();
    if (!session || session.user?.email !== 'test@example.com') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user ID from the URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    
    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' }, 
        { status: 400 }
      );
    }
    
    // Delete the user
    const deleted = await deleteUser(userId);
    
    if (deleted) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { error: 'User not found or could not be deleted' }, 
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error in DELETE /api/admin/users:', error);
    
    if (error.message === 'Cannot delete admin user') {
      return NextResponse.json(
        { error: 'Cannot delete admin user' }, 
        { status: 403 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete user' }, 
      { status: 500 }
    );
  }
}