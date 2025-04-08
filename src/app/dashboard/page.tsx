'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Dashboard Icons
import { FiHome, FiUsers, FiCreditCard, FiPieChart, FiSettings, FiLogOut, FiPlusCircle, FiDollarSign, FiCoffee } from 'react-icons/fi';

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Use real authentication
  const { data: session, status } = useSession();
  
  // State for data from Neo4j database
  const [groups, setGroups] = useState<any[]>([]);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Sign out handler
  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
      // Force redirect to home page if signOut fails
      window.location.href = '/';
    }
  };

  // Fetch data from Neo4j database
  useEffect(() => {
    const fetchData = async () => {
      if (status !== 'authenticated') return;
      
      setIsLoading(true);
      setError('');
      
      try {
        // Fetch groups
        const groupsResponse = await fetch('/api/groups');
        if (!groupsResponse.ok) throw new Error('Failed to fetch groups');
        const groupsData = await groupsResponse.json();
        setGroups(groupsData);
        
        // Fetch expenses
        const expensesResponse = await fetch('/api/expenses');
        if (!expensesResponse.ok) throw new Error('Failed to fetch expenses');
        const expensesData = await expensesResponse.json();
        setExpenses(expensesData);
        
        // Fetch virtual cards
        const cardsResponse = await fetch('/api/cards');
        if (!cardsResponse.ok) throw new Error('Failed to fetch cards');
        const cardsData = await cardsResponse.json();
        setCards(cardsData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [status]);
  
  // Format data for display
  const formattedData = {
    groups: groups && groups.length ? groups.map(g => ({
      id: g.id,
      name: g.name,
      members: g.memberCount,
      totalExpenses: g.totalExpenses || 0,
      yourShare: (g.totalExpenses || 0) / g.memberCount || 0,
      image: g.image || `/images/illustrations/group-${g.id.charAt(0)}.svg`,
      status: g.status
    })) : [],
    recentExpenses: expenses && expenses.length ? expenses.slice(0, 5).map(e => ({
      id: e.id,
      description: e.description,
      group: e.groupName,
      amount: e.amount,
      date: new Date(e.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      paidBy: e.paidByYou ? 'You' : e.paidByName,
      yourShare: e.yourShare
    })) : [],
    cards: cards && cards.length ? cards.map((c, index) => ({
      id: c.id,
      name: c.name || `${c.groupName} Card`,
      number: c.number || '•••• •••• •••• ' + (1000 + index).toString(),
      expiry: c.expiry || '12/25',
      available: c.balance || 0,
      spent: c.spent || 0,
      color: index % 2 === 0 ? 'indigo' : 'teal'
    })) : [],
    balances: {
      youOwe: expenses && expenses.length ? expenses.filter(e => !e.paidByYou).reduce((sum, e) => sum + e.yourShare, 0) : 0,
      owedToYou: expenses && expenses.length ? expenses.filter(e => e.paidByYou).reduce((sum, e) => sum + e.amount - e.yourShare, 0) : 0,
      netBalance: 0 // Will be calculated below
    },
    paymentMethods: [
      {
        id: 'pm_1',
        type: 'visa',
        last4: '4242',
        expiry: '04/25',
        name: 'Personal Visa',
        isDefault: true
      },
      {
        id: 'pm_2',
        type: 'mastercard',
        last4: '5555',
        expiry: '05/26',
        name: 'Work Mastercard',
        isDefault: false
      }
    ],
    fundingRequests: []
  };
  
  // Calculate net balance
  formattedData.balances.netBalance = formattedData.balances.owedToYou - formattedData.balances.youOwe;
  
  // Generate funding requests based on groups without cards
  formattedData.fundingRequests = formattedData.groups && formattedData.cards && formattedData.groups.length > 0
    ? formattedData.groups.filter(group => !formattedData.cards.some(card => card.name && card.name.includes(group.name)))
      .map(group => ({
        id: `fr_${group.id}`,
        groupName: group.name,
        amount: 75.00, // Default amount
        dueDate: new Date(Date.now() + 86400000 * 3).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
        status: 'pending'
      }))
    : [];

  // Define user data
  const userData = session?.user || {
    name: "Guest User",
    email: "",
    image: null
  };
    
  // Show loading spinner while authentication is in progress
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-64 bg-white shadow-md">
        <div className="p-4 border-b">
          <h2 className="text-2xl font-bold text-indigo-600">SplitApp</h2>
        </div>
        <div className="flex flex-col items-center py-8 border-b">
          <div className="relative w-20 h-20 rounded-full overflow-hidden bg-indigo-100">
            {userData.image ? (
              <Image src={userData.image} alt={userData.name || ''} fill className="object-cover" />
            ) : (
              <div className="flex items-center justify-center h-full text-2xl font-bold text-indigo-600">
                {userData.name?.charAt(0) || userData.email?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <h3 className="mt-4 font-medium text-gray-900">{userData.name}</h3>
          <p className="text-gray-500 text-sm">{userData.email}</p>
        </div>
        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            <li>
              <button 
                onClick={() => setActiveTab('overview')} 
                className={`flex items-center px-4 py-3 w-full text-left ${activeTab === 'overview' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <FiHome className="mr-3" />
                Overview
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('groups')} 
                className={`flex items-center px-4 py-3 w-full text-left ${activeTab === 'groups' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <FiUsers className="mr-3" />
                My Groups
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('cards')} 
                className={`flex items-center px-4 py-3 w-full text-left ${activeTab === 'cards' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <FiCreditCard className="mr-3" />
                Virtual Cards
              </button>
            </li>
            <li>
              <button 
                onClick={() => setActiveTab('settings')} 
                className={`flex items-center px-4 py-3 w-full text-left ${activeTab === 'settings' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-700 hover:bg-gray-50'}`}
              >
                <FiSettings className="mr-3" />
                Settings
              </button>
            </li>
          </ul>
        </nav>
        <div className="p-4 border-t">
          <button
            onClick={handleSignOut}
            className="flex items-center w-full px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
          >
            <FiLogOut className="mr-3" />
            Sign out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">

        {/* Dashboard content */}
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-2 md:mb-0">Hi, {userData.name || 'there'}!</h1>
            <div className="flex">
              <Link 
                href="/create-group" 
                className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
              >
                <FiUsers className="mr-2" />
                New Group
              </Link>
            </div>
          </div>

          {/* Removed Funding Requests Alert - Now shown in the overview section */}

          {/* Overview tab content */}
          {activeTab === 'overview' && (
            <div>
              {/* Payment requests alert */}
              {formattedData.fundingRequests.length > 0 && (
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Upcoming payments</p>
                      <p className="text-2xl font-bold text-indigo-600">${formattedData.fundingRequests.reduce((total, request) => total + request.amount, 0).toFixed(2)}</p>
                      <p className="text-sm text-gray-500 mt-1">{formattedData.fundingRequests.length} pending request(s)</p>
                    </div>
                    <div className="p-3 bg-indigo-100 rounded-full">
                      <FiCreditCard className="text-indigo-500" size={24} />
                    </div>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => setActiveTab('groups')}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-800"
                    >
                      View payment requests
                    </button>
                  </div>
                </div>
              )}

              {/* Groups and expenses sections */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Recent transactions */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Recent Expenses</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {formattedData.recentExpenses.slice(0, 4).map(expense => (
                      <div key={expense.id} className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{expense.description}</p>
                            <p className="text-sm text-gray-500">{expense.group} • {expense.date}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">Total: ${expense.amount.toFixed(2)}</p>
                            <p className="text-sm text-gray-600">Your share: ${expense.yourShare.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-3 bg-gray-50">
                    <Link href="/expenses" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      View all expenses
                    </Link>
                  </div>
                </div>

                {/* Your groups */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium text-gray-900">Your Groups</h2>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {formattedData.groups.map(group => (
                      <div key={group.id} className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-bold">{group.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <p className="font-medium text-gray-900">{group.name}</p>
                                {group.status === 'ongoing' && (
                                  <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                    Ongoing
                                  </span>
                                )}
                              </div>
                              <p className="text-sm font-medium text-gray-500">{group.members} members</p>
                            </div>
                            <div className="mt-1 flex items-center justify-between">
                              <p className="text-sm text-gray-500">Total: ${group.totalExpenses.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">Your share: ${group.yourShare.toFixed(2)}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="px-6 py-3 bg-gray-50">
                    <Link href="/groups" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                      View all groups
                    </Link>
                  </div>
                </div>
              </div>

              {/* Cards section */}
              <div className="mt-8">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Your Virtual Cards</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {formattedData.cards.map(card => (
                    <div 
                      key={card.id} 
                      className={`p-6 rounded-xl shadow-md relative overflow-hidden bg-gradient-to-r ${
                        card.color === 'indigo' ? 'from-indigo-500 to-purple-600' : 'from-teal-500 to-green-600'
                      }`}
                    >
                      <div className="absolute top-0 right-0 h-24 w-24 -mt-8 -mr-8 bg-white opacity-10 rounded-full"></div>
                      <div className="absolute bottom-0 left-0 h-32 w-32 -mb-12 -ml-12 bg-white opacity-10 rounded-full"></div>
                      
                      <div className="relative z-10">
                        <p className="text-white font-medium mb-6">{card.name}</p>
                        <p className="text-white font-bold text-lg tracking-wider mb-2">{card.number}</p>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white text-xs opacity-80">Expires</p>
                            <p className="text-white font-medium">{card.expiry}</p>
                          </div>
                          <div>
                            <p className="text-white text-xs opacity-80">Available</p>
                            <p className="text-white font-medium">${card.available.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Groups tab content - Enhanced with funding flow */}
          {activeTab === 'groups' && (
            <div>
              <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-medium text-gray-900">Pending Payment Requests</h2>
                </div>
                
                {formattedData.fundingRequests.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No pending payment requests
                  </div>
                ) : (
                  <div>
                    {formattedData.fundingRequests.map(request => (
                      <div key={request.id} className="p-6 border-b border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                          <div className="mb-4 md:mb-0">
                            <h3 className="text-lg font-medium text-gray-900">{request.groupName}</h3>
                            <p className="text-sm text-gray-500">Due: {new Date(request.dueDate).toLocaleDateString('en-US', {day: '2-digit', month: 'short', year: 'numeric'})}</p>
                          </div>
                          <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
                            <p className="font-bold text-xl text-gray-900">${request.amount.toFixed(2)}</p>
                            <div className="flex space-x-2">
                              <Link 
                                href={`/create-bill?email=${userData.email}&group=${encodeURIComponent(request.groupName)}`}
                                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                              >
                                Details
                              </Link>
                              <Link 
                                href={`/create-virtual-card?email=${userData.email}&group=${encodeURIComponent(request.groupName)}`}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                              >
                                Fund
                              </Link>
                            </div>
                          </div>
                        </div>
                        
                        {/* Payment Method Selection */}
                        <div className="mt-6 pt-6 border-t border-gray-200">
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Select Payment Method</h4>
                          <div className="space-y-2">
                            {formattedData.paymentMethods.map(method => (
                              <div key={method.id} className="flex items-center p-3 border rounded-md bg-gray-50 hover:bg-gray-100">
                                <input 
                                  type="radio" 
                                  id={method.id} 
                                  name="paymentMethod" 
                                  defaultChecked={method.isDefault}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <label htmlFor={method.id} className="ml-3 flex flex-1 items-center justify-between cursor-pointer">
                                  <div className="flex items-center">
                                    <div className="flex items-center justify-center h-8 w-12 bg-gray-100 rounded mr-2">
                                      {method.type === 'visa' && (
                                        <span className="text-blue-600 font-bold text-xs">VISA</span>
                                      )}
                                      {method.type === 'mastercard' && (
                                        <span className="text-red-600 font-bold text-xs">MC</span>
                                      )}
                                    </div>
                                    <div>
                                      <p className="text-sm font-medium text-gray-900">{method.name}</p>
                                      <p className="text-xs text-gray-500">•••• {method.last4} | Exp: {method.expiry}</p>
                                    </div>
                                  </div>
                                  {method.isDefault && (
                                    <span className="text-xs text-gray-500">Default</span>
                                  )}
                                </label>
                              </div>
                            ))}
                            
                            <button className="mt-2 flex items-center text-sm text-indigo-600 hover:text-indigo-800">
                              <FiPlusCircle className="mr-1" />
                              Add Payment Method
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">My Groups</h2>
                    <Link 
                      href="/create-group" 
                      className="inline-flex items-center px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-md hover:bg-indigo-700"
                    >
                      <FiPlusCircle className="mr-1" />
                      Create
                    </Link>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {formattedData.groups.map(group => (
                    <div key={group.id} className="px-6 py-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start mb-3 md:mb-0">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-bold">{group.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="flex items-center">
                              <p className="font-medium text-gray-900">{group.name}</p>
                              {group.status === 'ongoing' && (
                                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                                  Ongoing
                                </span>
                              )}
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-500 mt-1">
                              <span>{group.members} members</span>
                              <span className="hidden sm:inline mx-2">•</span>
                              <span>Your share: ${group.yourShare.toFixed(2)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {/* Only show Fund Card button for ongoing expenses in the pending requests section */}
                          <Link 
                            href={`/create-bill?email=${userData.email}&group=${encodeURIComponent(group.name)}`}
                            className="px-3 py-1 bg-gray-100 text-gray-800 text-sm font-medium rounded-md hover:bg-gray-200"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Cards tab content */}
          {activeTab === 'cards' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">Virtual Cards</h2>
                <p className="text-sm text-gray-500 mt-1">Virtual cards are automatically created when all group members add funding</p>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {formattedData.cards.map(card => (
                  <div key={card.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className={`p-6 relative overflow-hidden bg-gradient-to-r ${
                      card.color === 'indigo' ? 'from-indigo-500 to-purple-600' : 'from-teal-500 to-green-600'
                    }`}>
                      <div className="absolute top-0 right-0 h-24 w-24 -mt-8 -mr-8 bg-white opacity-10 rounded-full"></div>
                      <div className="absolute bottom-0 left-0 h-32 w-32 -mb-12 -ml-12 bg-white opacity-10 rounded-full"></div>
                      
                      <div className="relative z-10">
                        <p className="text-white font-medium mb-6">{card.name}</p>
                        <p className="text-white font-bold text-lg tracking-wider mb-2">{card.number}</p>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="text-white text-xs opacity-80">Expires</p>
                            <p className="text-white font-medium">{card.expiry}</p>
                          </div>
                          <div>
                            <p className="text-white text-xs opacity-80">Available</p>
                            <p className="text-white font-medium">${card.available.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h3 className="font-medium">Fund Status</h3>
                          <p className="text-sm text-gray-500">2/2 Members Funded</p>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                          Active
                        </span>
                      </div>
                      
                      <div className="border-t border-gray-200 pt-4 flex justify-between">
                        <button className="text-gray-600 text-sm hover:text-gray-900">Card Details</button>
                        <button className="text-indigo-600 text-sm hover:text-indigo-800">Top Up</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other tabs would follow the same pattern */}
          {activeTab === 'expenses' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Expenses</h2>
              <p className="text-gray-600">This feature has been removed.</p>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics</h2>
              <p className="text-gray-600">This feature has been removed.</p>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Settings</h2>
              <p className="text-gray-600">Detailed settings content would appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}