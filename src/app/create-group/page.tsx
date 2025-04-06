import React from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Link from 'next/link';
import Image from 'next/image';
export default function CreateGroup() {
  return (
    <main>
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Create a New Group</h1>
            <p className="text-gray-600">Start by creating a group and adding members to split expenses with.</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <form>
              <div className="mb-6">
                <label htmlFor="group-name" className="label">Group Name</label>
                <input
                  type="text"
                  id="group-name"
                  className="input"
                  placeholder="e.g., Weekend Trip, Roommates, Dinner with Friends"
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="group-description" className="label">Description (Optional)</label>
                <textarea
                  id="group-description"
                  className="input min-h-[100px]"
                  placeholder="Brief description of what this group is for"
                />
              </div>
              <div className="mb-6">
                <label className="label">Group Members</label>
                <div className="p-4 border border-gray-300 rounded-md mb-2">
                  <div className="flex items-center mb-4">
                    <div className="h-10 w-10 bg-primary text-white rounded-full flex items-center justify-center mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <span>You (Group Creator)</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex items-center mb-4">
                      <input
                        type="email"
                        className="input flex-grow mr-2"
                        placeholder="Enter email or phone number"
                      />
                      <button
                        type="button"
                        className="btn btn-primary whitespace-nowrap"
                      >
                        Add Member
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Members can be added after creating the group as well</span>
                </div>
              </div>
              <div className="mb-6">
                <label className="label">Group Settings</label>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input type="checkbox" id="equal-split" className="h-4 w-4 mr-2" />
                    <label htmlFor="equal-split">Default to equal splits for all expenses</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="allow-members-add" className="h-4 w-4 mr-2" />
                    <label htmlFor="allow-members-add">Allow members to add expenses</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="notify-expense" className="h-4 w-4 mr-2" />
                    <label htmlFor="notify-expense">Notify all members when a new expense is added</label>
                  </div>
                </div>
              </div>
              <div className="flex justify-between">
                <Link href="/" className="btn bg-gray-200 text-gray-800 hover:bg-gray-300">
                  Cancel
                </Link>
                <Link href="/create-bill" className="btn btn-primary">
                  Create Group
                </Link>
              </div>
            </form>
          </div>
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Quick Tips</h3>
                <div className="mt-2 text-sm text-blue-700">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Create groups for different occasions or regular expenses</li>
                    <li>Be specific with the group name to easily identify it later</li>
                    <li>Adding a brief description helps everyone understand the purpose</li>
                    <li>You can always edit the group and add more members later</li>
                  </ul>
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
