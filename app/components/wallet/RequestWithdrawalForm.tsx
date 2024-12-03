"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/app/context/AuthContext";

const RequestWithdrawalForm: React.FC = () => {
  const [amount, setAmount] = useState<number | "">("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { userName, walletId } = useAuthContext();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setError("");
    // console.log(userName);
    // console.log(walletId);


    if (!userName || !walletId || !amount || amount <= 0) {
      setError("Please provide valid details.");
      return;
    }

    try {
      const payload = {
        username: userName,
        amount,
      };
      // console.log("Payload being sent:", payload);

      const response = await fetch("/api/wallets/request-withdrawal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong.");
      } else {
        setMessage(result.message || "Request submitted successfully.");
        setAmount("");
        router.push("/wallet");
      }
    } catch (err) {
      console.error("Error submitting request:", err);
      setError("An unexpected error occurred.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white border rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-gray-700">
        Request Withdrawal
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Amount */}
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value) || "")}
            className="text-gray-500 w-full mt-1 px-4 py-2 border rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter amount to withdraw"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
        >
          Submit Request
        </button>
      </form>

      {/* Success or Error Message */}
      {message && <p className="mt-4 text-green-600">{message}</p>}
      {error && <p className="mt-4 text-red-600">{error}</p>}
    </div>
  );
};

export default RequestWithdrawalForm;
