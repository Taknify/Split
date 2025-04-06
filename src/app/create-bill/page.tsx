import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
export default function CreateBill() {
  return (
    <main>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create a New Bill</h1>
            <p className="text-gray-600">Add a new expense to split with your group</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label htmlFor="expense-title" className="label">Expense Title</label>
                  <input
                    type="text"
                    id="expense-title"
                    className="input"
                    placeholder="e.g., Dinner at La Toque"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="group" className="label">Group</label>
                  <select id="group" className="input">
                    <option value="group_1">Weekend Getaway</option>
                    <option value="group_2">Roommates</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <label htmlFor="amount" className="label">Total Amount</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500">$</span>
                    </div>
                    <input
                      type="number"
                      id="amount"
                      className="input pl-7"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="date" className="label">Date</label>
                  <input
                    type="date"
                    id="date"
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="paid-by" className="label">Paid By</label>
                  <select id="paid-by" className="input">
                    <option value="you">You</option>
                    <option value="user_2">Jamie Smith</option>
                    <option value="user_3">Taylor Wilson</option>
                    <option value="user_4">Morgan Chen</option>
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="label">Receipt Image (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
                  <div className="mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <label htmlFor="file-upload" className="text-primary cursor-pointer hover:text-primary/80">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                    </label>
                    <p>or drag and drop</p>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                  </div>
                  <div>
                    <button
                      type="button"
                      className="btn bg-gray-200 text-gray-800 hover:bg-gray-300"
                    >
                      Scan Receipt
                    </button>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label className="label">Split Type</label>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <input type="radio" id="split-equal" name="split-type" className="h-4 w-4 mr-2" checked />
                    <label htmlFor="split-equal">Equal Split</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="split-amount" name="split-type" className="h-4 w-4 mr-2" />
                    <label htmlFor="split-amount">By Amount</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="split-percentage" name="split-type" className="h-4 w-4 mr-2" />
                    <label htmlFor="split-percentage">By Percentage</label>
                  </div>
                  <div className="flex items-center">
                    <input type="radio" id="split-items" name="split-type" className="h-4 w-4 mr-2" />
                    <label htmlFor="split-items">By Items (from receipt)</label>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label className="label">Participants</label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input type="checkbox" id="user-you" className="h-4 w-4 mr-2" checked />
                    <label htmlFor="user-you">You</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="user-jamie" className="h-4 w-4 mr-2" checked />
                    <label htmlFor="user-jamie">Jamie Smith</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="user-taylor" className="h-4 w-4 mr-2" checked />
                    <label htmlFor="user-taylor">Taylor Wilson</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="user-morgan" className="h-4 w-4 mr-2" checked />
                    <label htmlFor="user-morgan">Morgan Chen</label>
                  </div>
                </div>
              </div>
              <div className="mb-6">
                <label htmlFor="notes" className="label">Notes (Optional)</label>
                <textarea
                  id="notes"
                  className="input min-h-[100px]"
                  placeholder="Any additional details about this expense..."
                />
              </div>
              <div className="flex justify-between">
                <Link href="/" className="btn bg-gray-200 text-gray-800 hover:bg-gray-300">
                  Cancel
                </Link>
                <div>
                  <Link href="/create-virtual-card" className="btn btn-primary ml-4">
                    Create Virtual Card
                  </Link>
                </div>
              </div>
            </form>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Virtual Card Option</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>After creating this bill, you'll have the option to create a virtual card funded by all participants. This allows for immediate payment without one person having to front the entire bill.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
