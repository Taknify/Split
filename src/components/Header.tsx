"use client";
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Use real session from NextAuth
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';
  
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">SplitApp</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 px-3 py-2 text-sm font-medium">
              Dashboard
            </Link>
            <Link href="/stripe-test" className="text-indigo-600 hover:text-indigo-800 px-3 py-2 text-sm font-medium">
              Stripe Test
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <>
                <span className="text-gray-700 px-3 py-2 text-sm font-medium">
                  Hello, {session.user?.name || session.user?.email}
                </span>
                <button 
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
                  Login
                </Link>
                <Link href="/auth/register" className="btn btn-primary">
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
          <div className="md:hidden flex items-center">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 border-t">
            <Link href="/dashboard" className="block px-4 py-2 text-base font-medium text-indigo-600 hover:text-indigo-800">
              Dashboard
            </Link>
            <Link href="/stripe-test" className="block px-4 py-2 text-base font-medium text-indigo-600 hover:text-indigo-800">
              Stripe Test
            </Link>
            {session ? (
              <button 
                onClick={() => signOut({ callbackUrl: '/' })} 
                className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:text-primary"
              >
                Sign Out
              </button>
            ) : (
              <>
                <Link href="/auth/login" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary">
                  Login
                </Link>
                <Link href="/auth/register" className="block px-4 py-2 text-base font-medium text-primary">
                  Sign Up Free
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
export default Header;