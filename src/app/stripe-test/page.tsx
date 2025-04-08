'use client';

import { useState, useEffect } from 'react';
import Spinner from '../../components/ui/Spinner';

export default function StripeTestPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<any>(null);
  
  // Payment Intent State
  const [paymentIntent, setPaymentIntent] = useState<any>(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  
  // Virtual Card State
  const [virtualCard, setVirtualCard] = useState<any>(null);
  const [cardLoading, setCardLoading] = useState(false);
  const [cardError, setCardError] = useState<string | null>(null);
  
  // Form State
  const [amount, setAmount] = useState<number>(10);
  const [cardName, setCardName] = useState<string>('Test Virtual Card');
  const [expiration, setExpiration] = useState<number>(24); // Hours

  useEffect(() => {
    // Test the Stripe connection when the page loads
    async function testStripeConnection() {
      try {
        setLoading(true);
        const response = await fetch('/api/test');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to test Stripe connection');
        }
        
        const data = await response.json();
        setTestResult(data);
        setError(null);
      } catch (err: any) {
        console.error('Error testing Stripe:', err);
        setError(err.message || 'An unknown error occurred');
        setTestResult(null);
      } finally {
        setLoading(false);
      }
    }

    testStripeConnection();
  }, []);
  
  // Create a payment intent
  const createPaymentIntent = async () => {
    try {
      setPaymentLoading(true);
      setPaymentError(null);
      
      const response = await fetch('/api/payment/intents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'usd',
          description: 'Test payment intent',
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create payment intent');
      }
      
      const data = await response.json();
      setPaymentIntent(data);
    } catch (err: any) {
      console.error('Error creating payment intent:', err);
      setPaymentError(err.message || 'An unknown error occurred');
    } finally {
      setPaymentLoading(false);
    }
  };
  
  // Create a virtual card
  const createVirtualCard = async () => {
    try {
      setCardLoading(true);
      setCardError(null);
      
      const response = await fetch('/api/cards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          cardName,
          expiration,
          oneTimeUse: true,
          exactAmount: true,
          metadata: {
            source: 'test-page',
            createdAt: new Date().toISOString(),
          },
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create virtual card');
      }
      
      const data = await response.json();
      setVirtualCard(data);
    } catch (err: any) {
      console.error('Error creating virtual card:', err);
      setCardError(err.message || 'An unknown error occurred');
    } finally {
      setCardLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Stripe Integration Test</h1>
      
      {/* Connection Test */}
      <div className="mb-10 border rounded-lg p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Connection Test</h2>
        
        {loading && (
          <div className="flex items-center space-x-2 bg-blue-50 p-4 rounded-lg">
            <Spinner className="text-blue-600 h-5 w-5" />
            <p className="text-blue-700">Testing Stripe connection...</p>
          </div>
        )}
        
        {error && (
          <div className="bg-red-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error</h2>
            <p className="text-red-700">{error}</p>
          </div>
        )}
        
        {testResult && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold text-green-700 mb-2">Success!</h2>
            <p className="text-green-700 mb-2">{testResult.message}</p>
            
            {testResult.availableBalance && (
              <div className="mt-4">
                <h3 className="text-lg font-medium text-green-700 mb-2">Available Balance:</h3>
                <ul className="list-disc list-inside">
                  {testResult.availableBalance.map((balance: any, index: number) => (
                    <li key={index} className="text-green-700">
                      {balance.currency.toUpperCase()}: {balance.amount.toFixed(2)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            <p className="text-sm text-green-600 mt-4">Timestamp: {testResult.timestamp}</p>
          </div>
        )}
      </div>
      
      {/* Payment Intent Test */}
      <div className="mb-10 border rounded-lg p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Payment Intent Test</h2>
        
        <div className="mb-6">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
            Amount (USD)
          </label>
          <div className="flex items-center">
            <input
              id="amount"
              type="number"
              min="0.50"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="mr-2 block w-32 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              onClick={createPaymentIntent}
              disabled={paymentLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {paymentLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4 text-white" />
                  Creating...
                </>
              ) : (
                'Create Payment Intent'
              )}
            </button>
          </div>
        </div>
        
        {paymentError && (
          <div className="bg-red-50 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-red-700 mb-2">Error</h3>
            <p className="text-red-700">{paymentError}</p>
          </div>
        )}
        
        {paymentIntent && (
          <div className="bg-green-50 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-green-700 mb-2">Payment Intent Created!</h3>
            <div className="mt-2 text-sm text-green-800">
              <p className="mb-1"><span className="font-medium">ID:</span> {paymentIntent.id}</p>
              <p className="mb-1"><span className="font-medium">Client Secret:</span> {paymentIntent.clientSecret.slice(0, 10)}...</p>
              <p className="mb-1"><span className="font-medium">Status:</span> Awaiting payment method</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Virtual Card Test */}
      <div className="mb-10 border rounded-lg p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">Virtual Card Test</h2>
        
        <p className="mb-4 text-gray-700">
          Create a virtual card with the specified amount. For testing purposes, the card will be simulated unless Stripe Issuing is fully configured.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="card-amount" className="block text-sm font-medium text-gray-700 mb-1">
              Amount (USD)
            </label>
            <input
              id="card-amount"
              type="number"
              min="0.50"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 mb-1">
              Card Name
            </label>
            <input
              id="card-name"
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div>
            <label htmlFor="expiration" className="block text-sm font-medium text-gray-700 mb-1">
              Expiration (hours)
            </label>
            <input
              id="expiration"
              type="number"
              min="1"
              step="1"
              value={expiration}
              onChange={(e) => setExpiration(parseInt(e.target.value))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={createVirtualCard}
              disabled={cardLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {cardLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4 text-white" />
                  Creating...
                </>
              ) : (
                'Create Virtual Card'
              )}
            </button>
          </div>
        </div>
        
        {cardError && (
          <div className="bg-red-50 p-4 rounded-lg mb-4">
            <h3 className="text-lg font-semibold text-red-700 mb-2">Error</h3>
            <p className="text-red-700">{cardError}</p>
          </div>
        )}
        
        {virtualCard && (
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-green-700 mb-2">Virtual Card Created!</h3>
            
            <div className="bg-white p-4 rounded-md border border-green-200 mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase">Card Number</p>
                  <p className="font-mono">
                    {virtualCard.cardDetails?.number || `**** **** **** ${virtualCard.last4}`}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Expiration</p>
                  <p className="font-mono">
                    {virtualCard.cardDetails?.exp_month || '12'}/{virtualCard.cardDetails?.exp_year || '25'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">CVV</p>
                  <p className="font-mono">{virtualCard.cardDetails?.cvc || '***'}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase">Card ID</p>
                  <p className="font-mono text-xs truncate">{virtualCard.id}</p>
                </div>
              </div>
            </div>
            
            <div className="text-sm text-green-800">
              <p className="mb-1"><span className="font-medium">Status:</span> {virtualCard.status}</p>
              <p className="mb-1"><span className="font-medium">Card Name:</span> {virtualCard.metadata?.cardName}</p>
              <p className="mb-1"><span className="font-medium">One-time use:</span> {virtualCard.metadata?.oneTimeUse === 'true' ? 'Yes' : 'No'}</p>
            </div>
          </div>
        )}
      </div>
      
      {/* API Endpoints */}
      <div className="mt-8 border rounded-lg p-6 bg-gray-50">
        <h2 className="text-xl font-semibold mb-4">API Endpoints Available:</h2>
        <ul className="list-disc list-inside space-y-2">
          <li><code className="bg-gray-100 px-1 rounded">/api/test</code> - Test Stripe connection</li>
          <li><code className="bg-gray-100 px-1 rounded">/api/payment/intents</code> - Create and confirm payment intents</li>
          <li><code className="bg-gray-100 px-1 rounded">/api/payment/capture</code> - Capture authorized payments</li>
          <li><code className="bg-gray-100 px-1 rounded">/api/cards</code> - Create and manage virtual cards</li>
          <li><code className="bg-gray-100 px-1 rounded">/api/payment/group-expense</code> - Process group expenses</li>
          <li><code className="bg-gray-100 px-1 rounded">/api/webhooks/stripe</code> - Handle Stripe events</li>
        </ul>
      </div>
    </div>
  );
}