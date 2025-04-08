import Link from 'next/link';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  // Redirect if user is already logged in
  const session = await auth();
  if (session?.user) {
    redirect('/');
  }

  const error = searchParams?.error;
  let errorMessage = 'An unexpected error occurred';

  // Map error codes to messages
  if (error === 'CredentialsSignin') {
    errorMessage = 'Invalid email or password';
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-red-600">Authentication Error</h1>
          <p className="mt-2 text-gray-600">{errorMessage}</p>
        </div>

        <div className="text-center mt-8">
          <Link
            href="/auth/login"
            className="inline-flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}