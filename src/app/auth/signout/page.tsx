'use client';

import { useEffect } from 'react';
import { signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function SignOutPage() {
  const router = useRouter();

  useEffect(() => {
    const performSignOut = async () => {
      try {
        // Use callbackUrl parameter to let NextAuth handle redirect
        await signOut({ callbackUrl: '/' });
      } catch (error) {
        console.error('Error during sign out:', error);
        // Fallback direct navigation
        window.location.href = '/';
      }
    };
    performSignOut();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Signing out...</h1>
        <p className="text-gray-600">You will be redirected to the home page.</p>
        <div className="mt-6 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mx-auto"></div>
      </div>
    </div>
  );
}