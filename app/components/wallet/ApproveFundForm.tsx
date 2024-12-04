'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';



const ApproveFundForm = () => {
  const [transactionId, setTransactionId] = useState('');
  const [action, setAction] = useState<'approve' | 'reject' | ''>('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(true); // State to toggle form visibility
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResponseMessage(null);

    if (!transactionId || !action) {
      setError('Please provide a transaction ID and select an action.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/wallet/addfundapprovel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transactionId, action }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'An unexpected error occurred.');
      } else {
        setResponseMessage(data.message);
        setIsFormVisible(false); // Hide the form after successful submission
      }

      router.push('/wallet');
    } catch (error) { // `error` is now used
      console.log('Failed to connect to the server.',error);
      setError('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  return isFormVisible ? (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md bg-white p-6 rounded shadow-md"
    >
      <div className="mb-4">
        <label htmlFor="transactionId" className="block text-sm font-medium text-gray-700">
          Transaction ID
        </label>
        <input
          type="text"
          id="transactionId"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          className="text-gray-500 mt-1 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          placeholder="Enter Transaction ID"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">Action</label>
        <div className="mt-2 flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="action"
              value="approve"
              checked={action === 'approve'}
              onChange={() => setAction('approve')}
              className="text-blue-600 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Approve</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="action"
              value="reject"
              checked={action === 'reject'}
              onChange={() => setAction('reject')}
              className="text-red-600 focus:ring-red-500"
            />
            <span className="ml-2 text-sm text-gray-700">Reject</span>
          </label>
        </div>
      </div>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      {responseMessage && <p className="text-green-500 text-sm mb-4">{responseMessage}</p>}
      <button
        type="submit"
        className={`w-full bg-blue-600 text-white py-2 px-4 rounded ${
          isLoading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
        disabled={isLoading}
      >
        {isLoading ? 'Processing...' : 'Submit'}
      </button>
    </form>
  ) : (
    <p className="text-green-500 text-lg font-medium">Admin Response Submitted Successfully</p>
  );
};

export default ApproveFundForm;
