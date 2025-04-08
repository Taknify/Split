'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiArrowLeft, FiUpload, FiCamera, FiAlertCircle } from 'react-icons/fi';

// Component to handle search params safely
function CreateBillContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State for form values
  const [title, setTitle] = useState('Dinner at Restaurant');
  const [group, setGroup] = useState('dinner');
  const [amount, setAmount] = useState(100);
  const [date, setDate] = useState('');
  const [paidBy, setPaidBy] = useState('you');
  const [splitType, setSplitType] = useState('equal');
  const [notes, setNotes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [hasGroupParam, setHasGroupParam] = useState(false);
  
  // Get today's date in YYYY-MM-DD format for the default date value
  useEffect(() => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    setDate(`${year}-${month}-${day}`);
    
    // Check if we're editing an existing bill or coming from a group
    const groupParam = searchParams.get('group');
    if (groupParam) {
      setGroup(groupParam);
      // If it's Dinner at Restaurant, preset the title
      if (groupParam === 'dinner' || groupParam === 'Dinner at Restaurant') {
        setTitle('Dinner at Restaurant');
      }
      // Mark that we have a group param to hide the group dropdown
      setHasGroupParam(true);
    }
    
    // Check if we're in edit mode
    const editParam = searchParams.get('edit');
    if (editParam === 'true') {
      setIsEditMode(true);
    }
  }, [searchParams]);
  
  // Participants with fixed 50/50 split
  const participants = [
    { id: 'user-1', name: 'Admin User', email: 'adharbhattarai@gmail.com', checked: true, split: 50 },
    { id: 'user-2', name: 'Regular User', email: 'user@example.com', checked: true, split: 50 }
  ];
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate form submission delay
    setTimeout(() => {
      setIsLoading(false);
      // Redirect to the dashboard or virtual card creation
      router.push('/create-virtual-card?amount=100&group=dinner');
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header with back/edit button */}
          <div className="flex items-center mb-8">
            {isEditMode ? (
              <div className="mr-4 p-2 rounded-full text-blue-500 hover:text-blue-700 hover:bg-gray-100">
                <span className="font-medium">Edit Mode</span>
              </div>
            ) : (
              <Link 
                href="/dashboard" 
                className="mr-4 p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              >
                <FiArrowLeft size={20} />
              </Link>
            )}
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{isEditMode ? 'Edit Bill' : 'Create a New Bill'}</h1>
              <p className="text-gray-600 text-sm">Split expenses with your group members</p>
            </div>
          </div>
          
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Bill details section */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Bill Details</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Bill Title
                  </label>
                  <input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="e.g., Dinner at Restaurant"
                    required
                  />
                </div>
                
                {!hasGroupParam ? (
                  <div>
                    <label htmlFor="group" className="block text-sm font-medium text-gray-700 mb-1">
                      Group
                    </label>
                    <select
                      id="group"
                      value={group}
                      onChange={(e) => setGroup(e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      required
                    >
                      <option value="lunch">Weekly Team Lunch</option>
                      <option value="dinner">Dinner at Restaurant</option>
                      <option value="roommates">Roommates</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label htmlFor="group-display" className="block text-sm font-medium text-gray-700 mb-1">
                      Group
                    </label>
                    <input
                      id="group-display"
                      type="text"
                      value={group}
                      readOnly
                      className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-md shadow-sm focus:outline-none sm:text-sm"
                    />
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                    Total Amount
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      id="amount"
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(parseFloat(e.target.value))}
                      className="block w-full pl-7 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      placeholder="0.00"
                      min="0.01"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="paidBy" className="block text-sm font-medium text-gray-700 mb-1">
                    Paid By
                  </label>
                  <select
                    id="paidBy"
                    value={paidBy}
                    onChange={(e) => setPaidBy(e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    required
                  >
                    <option value="you">You</option>
                    <option value="admin">Admin User</option>
                    <option value="user">Regular User</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Receipt Image (Optional)
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <FiUpload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    
                    <button
                      type="button"
                      className="mt-2 inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <FiCamera className="mr-1" />
                      Scan Receipt
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Split details section */}
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Split Details</h2>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Split Type</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center">
                    <input 
                      id="split-equal" 
                      name="splitType" 
                      type="radio" 
                      checked={splitType === 'equal'} 
                      onChange={() => setSplitType('equal')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="split-equal" className="ml-2 block text-sm text-gray-700">
                      Equal Split
                    </label>
                  </div>
                  <div className="flex items-center opacity-50 cursor-not-allowed">
                    <input 
                      id="split-amount" 
                      name="splitType" 
                      type="radio" 
                      disabled
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="split-amount" className="ml-2 block text-sm text-gray-700">
                      By Amount
                    </label>
                  </div>
                  <div className="flex items-center opacity-50 cursor-not-allowed">
                    <input 
                      id="split-percentage" 
                      name="splitType" 
                      type="radio" 
                      disabled
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="split-percentage" className="ml-2 block text-sm text-gray-700">
                      By Percentage
                    </label>
                  </div>
                  <div className="flex items-center opacity-50 cursor-not-allowed">
                    <input 
                      id="split-items" 
                      name="splitType" 
                      type="radio" 
                      disabled
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="split-items" className="ml-2 block text-sm text-gray-700">
                      By Items
                    </label>
                  </div>
                </div>
                
                {/* Info banner for fixed 50/50 split */}
                <div className="mt-4 bg-blue-50 border-l-4 border-blue-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <FiAlertCircle className="h-5 w-5 text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        This expense will be split equally (50/50) between the two group members.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Participants</label>
                <div className="bg-gray-50 rounded-md divide-y divide-gray-200">
                  {participants.map(participant => (
                    <div key={participant.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center">
                        <input
                          id={participant.id}
                          name="participants"
                          type="checkbox"
                          checked={participant.checked}
                          readOnly
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        />
                        <label htmlFor={participant.id} className="ml-3 flex items-center">
                          <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center mr-2">
                            <span className="text-indigo-800 font-medium text-sm">{participant.name.charAt(0)}</span>
                          </div>
                          <div>
                            <span className="block text-sm font-medium text-gray-900">{participant.name}</span>
                            <span className="block text-xs text-gray-500">{participant.email}</span>
                          </div>
                        </label>
                      </div>
                      <div className="text-right">
                        <span className="block text-sm font-medium text-gray-900">${(amount * participant.split / 100).toFixed(2)}</span>
                        <span className="block text-xs text-gray-500">{participant.split}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Add any details about this expense..."
                />
              </div>
            </div>
            
            {/* Submit buttons */}
            <div className="p-6 bg-gray-50 flex justify-between">
              <Link 
                href="/dashboard?tab=groups" 
                className="px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isEditMode ? 'Discard Changes' : 'Cancel'}
              </Link>
              
              <div className="space-x-3">
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save & Create Virtual Card'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

// Export a wrapper that safely handles the search params
export default function CreateBill() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <CreateBillContent />
    </Suspense>
  );
}