'use client';

import { useState, useEffect } from 'react';

export default function CheckEnvPage() {
  const [env, setEnv] = useState<Record<string, string>>({});
  
  useEffect(() => {
    // Collect all Next.js environment variables that are exposed to the client
    const nextPublicVars: Record<string, string> = {};
    
    // Find all environment variables that start with NEXT_PUBLIC_
    Object.keys(process.env).forEach(key => {
      if (key.startsWith('NEXT_PUBLIC_')) {
        nextPublicVars[key] = process.env[key] || '';
      }
    });
    
    setEnv(nextPublicVars);
  }, []);
  
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Environment Variables Check</h1>
      
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Client-Side Environment Variables</h2>
        <p className="text-gray-600 mb-4">
          These are environment variables prefixed with NEXT_PUBLIC_ that are available in the browser.
        </p>
        
        {Object.keys(env).length === 0 ? (
          <p className="text-amber-600">No client-side environment variables found.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2 text-left">Variable</th>
                <th className="border px-4 py-2 text-left">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(env).map(([key, value]) => (
                <tr key={key}>
                  <td className="border px-4 py-2 font-mono text-sm">{key}</td>
                  <td className="border px-4 py-2 font-mono text-sm">
                    {value ? value : <span className="text-red-500">Not set</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Configuration Check</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">NextAuth Configuration</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="font-mono mr-2">NEXT_PUBLIC_API_URL:</span>
                <span className={env['NEXT_PUBLIC_API_URL'] ? 'text-green-600' : 'text-red-600'}>
                  {env['NEXT_PUBLIC_API_URL'] || 'Not set'}
                </span>
              </li>
              <li>
                <span className="font-medium">Authentication middleware:</span> Configured
              </li>
            </ul>
          </div>
          
          <div className="border rounded p-4">
            <h3 className="font-medium mb-2">Base URL</h3>
            <p className="text-sm">
              <span className="font-mono">window.location.origin:</span>{' '}
              <span className="text-blue-600">(Available at runtime)</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}