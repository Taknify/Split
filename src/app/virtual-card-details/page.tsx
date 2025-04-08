'use client';

import React, { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function VirtualCardDetails() {
  const router = useRouter();
  
  // State for user data
  const [userData, setUserData] = useState({
    name: "Regular User",
    email: "user@example.com"
  });
  
  // State for group data
  const [groupData, setGroupData] = useState({
    name: "Dinner at Restaurant",
    amount: 100.00
  });
  
  // Get URL parameters
  useEffect(() => {
    // Check URL for user info
    const params = new URLSearchParams(window.location.search);
    const userEmail = params.get('email');
    const groupName = params.get('group');
    
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
    
    if (groupName) {
      setGroupData({
        name: groupName,
        amount: 100.00
      });
    }
  }, []);
  
  return (
    <main>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Virtual Card Details</h1>
            <p className="text-gray-600">Your virtual card is ready to use</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">Card Successfully Created!</h2>
                    <p className="text-gray-500">All participants have funded the card</p>
                  </div>
                </div>
                <div className="mb-8">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-6 text-white shadow-lg">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <p className="text-xs opacity-70 mb-1">SplitApp</p>
                        <h3 className="font-medium text-lg">{groupData.name}</h3>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                      </svg>
                    </div>
                    <div className="mb-6">
                      <p className="text-sm opacity-70 mb-1">Card Number</p>
                      <div className="flex justify-between">
                        <span className="font-mono text-lg">4532</span>
                        <span className="font-mono text-lg">8921</span>
                        <span className="font-mono text-lg">5731</span>
                        <span className="font-mono text-lg">9076</span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div>
                        <p className="text-xs opacity-70 mb-1">VALID THRU</p>
                        <p className="font-mono">11/23</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-70 mb-1">CVC</p>
                        <p className="font-mono">942</p>
                      </div>
                      <div>
                        <p className="text-xs opacity-70 mb-1">AMOUNT</p>
                        <p className="font-medium">${groupData.amount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="font-medium mb-4">Card Restrictions</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-md">
                      <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-medium">Expiration</span>
                      </div>
                      <p className="text-sm text-gray-600">Nov 13, 2023 (24 hours)</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                        </svg>
                        <span className="font-medium">Maximum Amount</span>
                      </div>
                      <p className="text-sm text-gray-600">${groupData.amount.toFixed(2)}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="font-medium">Merchant Lock</span>
                      </div>
                      <p className="text-sm text-gray-600">Restaurant</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-md">
                      <div className="flex items-center mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        <span className="font-medium">Usage</span>
                      </div>
                      <p className="text-sm text-gray-600">One-time use only</p>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="font-medium mb-4">Payment Methods</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                      <div className="flex items-center">
                        <div className="mr-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                          </svg>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">Visa ending in 4242</div>
                          <div className="font-medium">$105.13 charged</div>
                        </div>
                      </div>
                      <div className="text-green-600 text-sm font-medium">
                        Payment Complete
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <div>
                    <button className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                      </svg>
                      Save Card Image
                    </button>
                  </div>
                  <div>
                    <button className="btn bg-gray-200 text-gray-800 hover:bg-gray-300 flex items-center mr-4">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      Share Card
                    </button>
                    <Link href={`/dashboard?email=${userData.email}`} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
                      Back to Dashboard
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Using Your Card</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Online Payment</h3>
                    <p className="text-sm text-gray-600">
                      Enter the card details at checkout just like a regular credit card. The card will be declined for amounts over $420.50.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">In-Person Payment</h3>
                    <p className="text-sm text-gray-600">
                      Add this virtual card to your mobile wallet for contactless payment, or read the numbers to the cashier.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Mobile Wallet</h3>
                    <div className="flex space-x-3 mt-3">
                      <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M12 19c.828 0 1.5-.672 1.5-1.5S12.828 16 12 16s-1.5.672-1.5 1.5.672 1.5 1.5 1.5z" />
                          <path d="M22 9c0 1.105-2.239 2-5 2s-5-.895-5-2" />
                          <path d="M17 13c0 1.105-2.239 2-5 2s-5-.895-5-2" />
                          <path d="M17 17c0 1.105-2.239 2-5 2s-5-.895-5-2" />
                          <path d="M7 9c0-1.105 2.239-2 5-2s5 .895 5 2-2.239 2-5 2-5-.895-5-2z" />
                        </svg>
                      </button>
                      <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="2" y="4" width="20" height="16" rx="2" />
                          <line x1="6" y1="12" x2="6" y2="12.01" />
                          <line x1="10" y1="12" x2="10" y2="12.01" />
                          <line x1="14" y1="12" x2="14" y2="12.01" />
                          <line x1="18" y1="12" x2="18" y2="12.01" />
                          <line x1="6" y1="16" x2="18" y2="16" />
                        </svg>
                      </button>
                      <button className="p-2 border border-gray-300 rounded-md hover:bg-gray-50">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M9 7H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-4" />
                          <rect x="9" y="3" width="6" height="4" rx="2" />
                          <path d="M3 10h18" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div>
                      <div className="font-medium">Card Created</div>
                      <div className="text-sm text-gray-500">Nov 12, 2023 - 3:45 PM</div>
                    </div>
                    <div className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                      Active
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 italic">
                    Transactions will appear here after the card is used.
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="font-medium mb-2">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  If you encounter any issues while using this virtual card, our support team is here to help.
                </p>
                <button className="w-full btn bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 mb-2 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                  Contact Support
                </button>
                <button className="w-full btn bg-white border border-gray-300 text-gray-800 hover:bg-gray-50 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  FAQs
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
