"use client";

import { useEffect, useState } from "react";
import { useAuthContext } from "@/app/context/AuthContext";

type WalletHistory = {
  _id: string;
  userId: string;
  transactionType: string;
  amount: number;
  transactionDate: string;
  approvalStatus: string;
  phoneTransition: string;
};

export default function WalletHistoryPage() {
  const [walletHistory, setWalletHistory] = useState<WalletHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { userId } = useAuthContext();

  // Check if userId is available before trying to fetch
  useEffect(() => {
    if (!userId) {
      setError("User is not authenticated.");
      setLoading(false);
      return;
    }

    const fetchWalletHistory = async () => {
      try {
        const response = await fetch(`/api/wallets/wallethistory/${userId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch wallet history");
        }
        const data = await response.json();
        setWalletHistory(data.walletHistory || []);
      } catch (error: any) {
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletHistory();
  }, [userId]); // Depend on userId to re-fetch when it changes

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin h-8 w-8 border-t-4 border-blue-600 rounded-full mx-auto"></div>
        <p className="mt-2 text-gray-500">Loading...</p>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-red-500 text-center">Error: {error}</div>;
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h1 className="text-3xl font-semibold text-center mb-6 text-indigo-700">
        Transaction History
      </h1>
      {walletHistory.length > 0 ? (
        <div className="space-y-4">
          {walletHistory.map((history) => (
            <div
              key={history._id}
              className="flex items-center p-6 bg-white shadow-lg rounded-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300"
            >
              {/* Transaction Icon */}
              <div className="flex-shrink-0">
                {/* Change icon based on transactionType */}
                {history.transactionType === "Credit" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-green-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 12h14M12 5l7 7-7 7"
                    />
                  </svg>
                ) : history.transactionType === "Withdraw" ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-red-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 12H5M12 5l-7 7 7 7"
                    />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 3v12a4 4 0 004 4h6a4 4 0 004-4V3M5 3h14M5 3a4 4 0 014-4h6a4 4 0 014 4"
                    />
                  </svg>
                )}
              </div>

              {/* Transaction Details */}
              <div className="ml-4 flex-grow">
                <div
                  className={`font-semibold text-xl text-gray-800 ${
                    history.transactionType === "Credit" ? "font-sans" : "font-serif"
                  }`}
                >
                  {history.transactionType}
                </div>
                <div className="text-sm text-gray-500">{new Date(history.transactionDate).toLocaleDateString()}</div>
              </div>

              {/* Amount */}
              <div className="flex-shrink-0 text-right">
                <div className="font-semibold text-xl text-gray-800">
                  {history.transactionType === "Refund" ? "-" : "+"}₹{history.amount.toFixed(2)}
                </div>
                <div
                  className={`text-xs mt-1 ${
                    history.approvalStatus === "approved" || history.approvalStatus === "Successful"
                      ? "text-green-500"
                      : history.approvalStatus === "pending"
                      ? "text-yellow-500"
                      : history.approvalStatus === "rejected"
                      ? "text-red-500"
                      : "text-gray-500"
                  }`}
                >
                  {history.approvalStatus}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No wallet history found for this user.</p>
      )}
    </div>
  );
}
