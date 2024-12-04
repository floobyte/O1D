'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/app/context/AuthContext';
import Image from 'next/image'; // Import Image from next/image

type FundFormProps = object; // or 'unknown'

const FundForm: React.FC<FundFormProps> = () => {
  const [amount, setAmount] = useState<number | ''>('');
  const [responseMessage, setResponseMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // State for popup visibility
  const { userName } = useAuthContext(); // Retrieve the logged-in user's username
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResponseMessage(null);

    if (!userName) {
      setError('User not logged in.');
      return;
    }

    if (!amount || amount <= 0) {
      setError('Please provide a positive amount.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/wallets/addFund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: userName, amount }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'An unexpected error occurred.');
      } else {
        setResponseMessage(data.message);
        setShowPopup(true); // Show the popup when the response is successful
      }

      router.push('/wallet');
    } catch {
      setError('Failed to connect to the server.');
    } finally {
      setIsLoading(false);
    }
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  return (
    <div className="relative p-6 rounded ">
      <form
        onSubmit={handleSubmit}
        className="sm:w-full max-w-md bg-white p-6 rounded"
      >
        <div className="mb-4">
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(parseFloat(e.target.value) || '')}
            className="text-gray-700 mt-1 p-4 block w-full rounded border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="Enter amount"
            required
            min="1"
          />
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
          {isLoading ? 'Submitting...' : 'Add Funds'}
        </button>
      </form>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg relative">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 bg-slate-950 rounded-lg p-1 text-gray-100 hover:text-white"
            >
              ✖
            </button>
            <Image
              src="/images/qrcode.png" // Replace with your actual image path
              alt="Success"
              className="w-48 h-48 object-cover"
              width={192}  // specify the width
              height={192} // specify the height
            />
            <p className="text-center text-lg font-medium mt-4 text-gray-700">
              UPI ID: 8795869889@ybl
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FundForm;
