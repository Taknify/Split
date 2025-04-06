import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function CreateVirtualCard() {
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
                    <span className="font-medium">Dinner at La Toque</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Group:</span>
                    <span className="font-medium">Weekend Getaway</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">Nov 12, 2023</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Amount:</span>
                    <span className="font-medium">$420.50</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Split Type:</span>
                    <span className="font-medium">Equal Split (4 people)</span>
                  </div>
                </div>

                <h3 className="font-medium mb-2">Participants</h3>
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center mr-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                      <div>
                        <div className="font-medium">You (Alex Johnson)</div>
                        <div className="text-sm text-gray-500">$105.13</div>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                      Card on File
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium">JS</span>
                      </div>
                      <div>
                        <div className="font-medium">Jamie Smith</div>
                        <div className="text-sm text-gray-500">$105.13</div>
                      </div>
                    </div>
                    <div className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                      Card on File
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium">TW</span>
                      </div>
                      <div>
                        <div className="font-medium">Taylor Wilson</div>
                        <div className="text-sm text-gray-500">$105.12</div>
                      </div>
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                      Invitation Sent
                    </div>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                    <div className="flex items-center">
                      <div className="h-10 w-10 bg-gray-200 text-gray-600 rounded-full flex items-center justify-center mr-3">
                        <span className="text-sm font-medium">MC</span>
                      </div>
                      <div>
                        <div className="font-medium">Morgan Chen</div>
                        <div className="text-sm text-gray-500">$105.12</div>
                      </div>
                    </div>
                    <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                      Invitation Sent
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
                  <label htmlFor="card-name" className="label">Card Name (Optional)</label>
                  <input
                    type="text"
                    id="card-name"
                    className="input"
                    placeholder="e.g., La Toque Dinner"
                  />
                </div>
                
                <div className="mb-6">
                  <label className="label">Card Settings</label>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input type="checkbox" id="one-time-use" className="h-4 w-4 mr-2" checked />
                      <label htmlFor="one-time-use">One-time use card (recommended)</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="merchant-lock" className="h-4 w-4 mr-2" checked />
                      <label htmlFor="merchant-lock">Lock to merchant "La Toque"</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="exact-amount" className="h-4 w-4 mr-2" checked />
                      <label htmlFor="exact-amount">Restrict to exact amount ($420.50)</label>
                    </div>
                    <div className="flex items-center">
                      <input type="checkbox" id="expiration" className="h-4 w-4 mr-2" checked />
                      <label htmlFor="expiration">Set expiration (24 hours)</label>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between">
                  <Link href="/create-bill" className="btn bg-gray-200 text-gray-800 hover:bg-gray-300">
                    Back
                  </Link>
                  <Link href="/virtual-card-details" className="btn btn-primary">
                    Create Virtual Card
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
                      <p className="font-medium">$420.50</p>
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
                      <span className="font-medium">$420.50</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Participant Count:</span>
                      <span className="font-medium">4</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-yellow-600">Awaiting 2 Payments</span>
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
