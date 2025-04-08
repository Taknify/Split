'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FiUsers, FiLogOut, FiTrash2, FiEdit, FiUserPlus, FiRefreshCw } from 'react-icons/fi';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeView, setActiveView] = useState('users');
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [statistics, setStatistics] = useState({
    totalUsers: 0,
    totalGroups: 0,
    totalExpenses: 0,
    totalAmount: 0,
    newUsersThisWeek: 0,
    activeGroups: 0
  });
  
  // Mock user data - will be replaced by API call
  const mockUsers = [
    { id: '1', name: 'Test User', email: 'test@example.com', role: 'Admin', createdAt: '2023-07-01', groups: 2, isAdmin: true },
    { id: '2', name: 'Alice Johnson', email: 'alice@example.com', role: 'User', createdAt: '2023-07-02', groups: 1, isAdmin: false },
    { id: '3', name: 'Bob Smith', email: 'bob@example.com', role: 'User', createdAt: '2023-07-03', groups: 1, isAdmin: false },
    { id: '4', name: 'Charlie Brown', email: 'charlie@example.com', role: 'User', createdAt: '2023-07-04', groups: 1, isAdmin: false },
  ];
  
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      if (session.user.email !== 'test@example.com') {
        // Only allow the admin user to access this page
        router.push('/dashboard');
      } else {
        // Load users and statistics
        fetchUsers();
        fetchStatistics();
      }
    }
  }, [status, router, session]);

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      // For demo purposes, we'll use mock data
      // In a real app, you'd use:
      // const response = await fetch('/api/admin/users');
      // const data = await response.json();
      // setUsers(data.users);
      
      // Simulate API delay
      setTimeout(() => {
        setUsers(mockUsers);
        setIsLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching users:', error);
      setIsLoading(false);
    }
  };
  
  // Fetch statistics from API
  const fetchStatistics = async () => {
    try {
      // For demo purposes, we'll use mock data
      // In a real app, you'd use:
      // const response = await fetch('/api/admin/stats');
      // const data = await response.json();
      // setStatistics(data.stats);
      
      // Simulate API delay
      setTimeout(() => {
        setStatistics({
          totalUsers: 4,
          totalGroups: 2,
          totalExpenses: 5,
          totalAmount: 1400.80,
          newUsersThisWeek: 1,
          activeGroups: 2
        });
      }, 500);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };
  
  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }
    
    try {
      // For demo purposes, we'll just update the local state
      // In a real app, you'd use:
      // await fetch(`/api/admin/users?id=${userId}`, { method: 'DELETE' });
      
      // Update local state
      setUsers(users.filter(user => user.id !== userId));
      
      // Update statistics
      setStatistics(prev => ({
        ...prev,
        totalUsers: prev.totalUsers - 1
      }));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };
  
  const handleRefreshUsers = () => {
    fetchUsers();
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!session || session.user.email !== 'test@example.com') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin header */}
      <header className="bg-indigo-700 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">SplitApp Admin</h1>
            <div className="ml-8 hidden md:flex space-x-4">
              <button 
                onClick={() => setActiveView('users')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeView === 'users' ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`}
              >
                Users
              </button>
              <button 
                onClick={() => setActiveView('statistics')}
                className={`px-3 py-2 rounded-md text-sm font-medium ${activeView === 'statistics' ? 'bg-indigo-800' : 'hover:bg-indigo-600'}`}
              >
                Statistics
              </button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="hidden md:inline-block text-sm">
              Logged in as {session.user.email}
            </span>
            <button
              onClick={handleSignOut}
              className="bg-indigo-800 hover:bg-indigo-900 px-4 py-2 rounded-md text-sm font-medium flex items-center"
            >
              <FiLogOut className="mr-2" />
              <span className="hidden md:inline-block">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile tabs */}
      <div className="md:hidden bg-white border-b">
        <div className="flex">
          <button 
            onClick={() => setActiveView('users')}
            className={`flex-1 py-3 text-center ${activeView === 'users' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
          >
            Users
          </button>
          <button 
            onClick={() => setActiveView('statistics')}
            className={`flex-1 py-3 text-center ${activeView === 'statistics' ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}
          >
            Statistics
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        {/* Users view */}
        {activeView === 'users' && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-2 md:mb-0">Manage Users</h2>
              <div className="flex space-x-3">
                <button
                  onClick={handleRefreshUsers}
                  className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-medium text-gray-700 hover:bg-gray-50"
                  disabled={isLoading}
                >
                  <FiRefreshCw className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
                <button
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700"
                >
                  <FiUserPlus className="mr-2" />
                  Add User
                </button>
              </div>
            </div>
            
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Created
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Groups
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          Loading users...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="font-medium text-indigo-600">{user.name.charAt(0)}</span>
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">{user.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              user.role === 'Admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.createdAt}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.groups}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-3">
                              <button
                                className="text-indigo-600 hover:text-indigo-900"
                                title="Edit user"
                              >
                                <FiEdit />
                              </button>
                              <button
                                className={`text-red-600 hover:text-red-900 ${user.isAdmin ? 'opacity-50 cursor-not-allowed' : ''}`}
                                onClick={() => !user.isAdmin && handleDeleteUser(user.id)}
                                disabled={user.isAdmin}
                                title={user.isAdmin ? "Admin users cannot be deleted" : "Delete user"}
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Statistics view */}
        {activeView === 'statistics' && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">System Statistics</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-indigo-500">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{statistics.totalUsers}</p>
                  </div>
                  <div className="p-3 bg-indigo-100 rounded-full">
                    <FiUsers className="text-indigo-600" size={24} />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  {statistics.newUsersThisWeek} new this week
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Active Groups</p>
                    <p className="text-2xl font-bold text-gray-900">{statistics.activeGroups}</p>
                  </div>
                  <div className="p-3 bg-green-100 rounded-full">
                    <FiUsers className="text-green-600" size={24} />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Total of {statistics.totalGroups} groups
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-purple-500">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900">${statistics.totalAmount.toFixed(2)}</p>
                  </div>
                  <div className="p-3 bg-purple-100 rounded-full">
                    <FiUsers className="text-purple-600" size={24} />
                  </div>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Across {statistics.totalExpenses} transactions
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System Overview</h3>
              <p className="text-gray-600 mb-4">
                The SplitApp is currently managing {statistics.totalUsers} users across {statistics.totalGroups} expense groups.
                There have been {statistics.totalExpenses} expenses created with a total value of ${statistics.totalAmount.toFixed(2)}.
              </p>
              
              <h4 className="font-medium text-gray-900 mt-6 mb-2">Recent Activity</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <span className="w-24 text-gray-500">Today</span>
                  <span>New user registered: Charlie Brown</span>
                </li>
                <li className="flex items-center">
                  <span className="w-24 text-gray-500">Yesterday</span>
                  <span>New expense added: "Rental Car" ($200.00)</span>
                </li>
                <li className="flex items-center">
                  <span className="w-24 text-gray-500">3 days ago</span>
                  <span>New group created: "Vacation Trip"</span>
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}