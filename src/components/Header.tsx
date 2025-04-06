"use client";

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary">SplitApp</span>
            </Link>
          </div>
          
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/features" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Features
            </Link>
            <Link href="/pricing" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Pricing
            </Link>
            <Link href="/about" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              About
            </Link>
          </nav>
          
          <div className="hidden md:flex items-center space-x-4">
            <Link href="/login" className="text-gray-700 hover:text-primary px-3 py-2 text-sm font-medium">
              Login
            </Link>
            <Link href="/signup" className="btn btn-primary">
              Sign Up Free
            </Link>
          </div>
          
          {/* Mobile menu button */}
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
      
      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="pt-2 pb-3 space-y-1 border-t">
            <Link href="/features" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary">
              Features
            </Link>
            <Link href="/pricing" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary">
              Pricing
            </Link>
            <Link href="/about" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary">
              About
            </Link>
            <Link href="/login" className="block px-4 py-2 text-base font-medium text-gray-700 hover:text-primary">
              Login
            </Link>
            <Link href="/signup" className="block px-4 py-2 text-base font-medium text-primary">
              Sign Up Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
