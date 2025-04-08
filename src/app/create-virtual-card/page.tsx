'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function CreateVirtualCard() {
  const router = useRouter();
  
  // State for user data
  const [userData, setUserData] = useState({
    name: "Regular User",
    email: "user@example.com"
  });
  
  // Get URL parameters
  useEffect(() => {
    // Check URL for user info
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('email');
    
    if (userEmail === 'adharbhattarai@gmail.com') {
      setUserData({
        name: "Admin User",
        email: "adharbhattarai@gmail.com"
      });
    } else if (userEmail) {
      setUserData({
        name: "Regular User",
        email: userEmail
      });
    }
  }, []);
  
  return (
    <main>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create Virtual Card</h1>
            <p className="text-gray-600">Generate a virtual card for immediate payment</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Bill Summary</h2>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expense:</span>
                    <span className="font-medium">Dinner at Restaurant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Group:</span>
                    <span className="font-medium">Dinner at Restaurant</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">Apr 7, 2025</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">$100.00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Split Type:</span>
                    <span className="font-medium">Equal Split (2 people)</span>
                  </div>
                </div>
                <h3 className="font-medium mb-2">Participants</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-indigo-600 text-white rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium">AU</span>
                      </div>
                      <div>
                        <div className="font-medium">Admin User</div>
                        <div className="text-sm text-gray-500">$50.00</div>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                      Card on File
                    </div>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium">RU</span>
                      </div>
                      <div>
                        <div className="font-medium">Regular User</div>
                        <div className="text-sm text-gray-500">$50.00</div>
                      </div>
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                      Payment Pending
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 rounded-md p-4 mb-6">
                  <div className="flex items-center mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="font-medium text-blue-800">Virtual Card Information</span>
                  </div>
                  <p className="text-sm text-blue-700">
                    All participants will be charged immediately to fund this virtual card. Once all have paid, the card will be created and ready to use for payment.
                  </p>
                </div>
                <div className="mb-6">
                  <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 mb-1">Card Name (Optional)</label>
                  <input
                    type="text"
                    id="card-name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="e.g., Dinner at Restaurant Card"
                    defaultValue="Dinner at Restaurant Card"
                  />
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Card Settings</label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input type="checkbox" id="one-time-use" className="h-4 w-4 mr-2 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" defaultChecked />
                      <label htmlFor="one-time-use" className="text-sm text-gray-700">One-time use card (recommended)</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="merchant-lock" className="h-4 w-4 mr-2 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" defaultChecked />
                      <label htmlFor="merchant-lock" className="text-sm text-gray-700">Lock to merchant "Restaurant"</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="exact-amount" className="h-4 w-4 mr-2 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" defaultChecked />
                      <label htmlFor="exact-amount" className="text-sm text-gray-700">Restrict to exact amount ($100.00)</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="expiration" className="h-4 w-4 mr-2 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" defaultChecked />
                      <label htmlFor="expiration" className="text-sm text-gray-700">Set expiration (24 hours)</label>
                    </div>
                  </div>
                </div>
                
                {/* Payment Method Selection */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Payment Method</label>
                  <div className="space-y-2">
                    <div className="flex items-center p-3 border rounded-md bg-gray-50 hover:bg-gray-100">
                      <input 
                        type="radio" 
                        id="pm_1" 
                        name="paymentMethod" 
                        defaultChecked
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="pm_1" className="ml-3 flex flex-1 items-center justify-between cursor-pointer">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center h-8 w-12 bg-gray-100 rounded mr-2">
                            <span className="text-blue-600 font-bold text-xs">VISA</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Personal Visa</p>
                            <p className="text-xs text-gray-500">•••• 4242 | Exp: 04/25</p>
                          </div>
                        </div>
                        <span className="text-xs text-gray-500">Default</span>
                      </label>
                    </div>
                    
                    <div className="flex items-center p-3 border rounded-md bg-gray-50 hover:bg-gray-100">
                      <input 
                        type="radio" 
                        id="pm_2" 
                        name="paymentMethod" 
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <label htmlFor="pm_2" className="ml-3 flex flex-1 items-center justify-between cursor-pointer">
                        <div className="flex items-center">
                          <div className="flex items-center justify-center h-8 w-12 bg-gray-100 rounded mr-2">
                            <span className="text-red-600 font-bold text-xs">MC</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Work Mastercard</p>
                            <p className="text-xs text-gray-500">•••• 5555 | Exp: 05/26</p>
                          </div>
                        </div>
                      </label>
                    </div>
                    
                    <button className="mt-2 flex items-center text-sm text-indigo-600 hover:text-indigo-800">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Payment Method
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Link 
                    href="/dashboard" 
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </Link>
                  <Link 
                    href="/virtual-card-details" 
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                  >
                    Fund & Create Virtual Card
                  </Link>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Virtual Card Preview</h2>
                <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg mb-4">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-xs opacity-70 mb-1">SplitApp</p>
                      <h3 className="font-medium text-lg">Virtual Card</h3>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                    </svg>
                  </div>
                  <div className="mb-6">
                    <p className="text-sm opacity-70 mb-1">Card Number</p>
                    <div className="flex space-x-4">
                      <span className="font-mono">•••• ••••</span>
                      <span className="font-mono">•••• ••••</span>
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs opacity-70 mb-1">VALID THRU</p>
                      <p className="font-mono">••/••</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70 mb-1">CVC</p>
                      <p className="font-mono">•••</p>
                    </div>
                    <div>
                      <p className="text-xs opacity-70 mb-1">AMOUNT</p>
                      <p className="font-medium">$100.00</p>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  This virtual card will be created once all participants have paid their share. The card details will be revealed after creation.
                </p>
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-medium mb-2">Summary</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Card Amount:</span>
                      <span className="font-medium">$100.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Participant Count:</span>
                      <span className="font-medium">2</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-yellow-600">Awaiting 1 Payment</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium mb-2">Secure & Convenient</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>No one has to front the bill</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Advanced security features</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Works anywhere credit cards are accepted</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Auto-expiring for extra security</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
