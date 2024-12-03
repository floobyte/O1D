// components/CreateSupportTicket.tsx
"use client";
import React, { useState, useEffect } from "react";

const RaiseTicket = () => {
  const [subjectLine, setSubjectLine] = useState("");
  const [priority, setPriority] = useState("");
  const [category, setCategory] = useState("");
  const [userId, setUserId] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch userId from sessionStorage
    const storedUserId = sessionStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch("/api/support/ticket", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ subjectLine, priority, category, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to create support ticket.");
      }

      const data = await response.json();
      setMessage(data.message);
      setSubjectLine("");
      setCategory("");
    } catch (err: any) {
      setError(err.message || "An error occurred while creating the ticket.");
    }
  };

  return (
    <div className="max-w-md  p-6 bg-white shadow-md rounded-lg text-gray-900 sm:mt-12 mt-40 m-4">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">Raise Ticket</h2>
      {error && <div className="text-red-500 mb-3">{error}</div>}
      {message && <div className="text-green-500 mb-3">{message}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label htmlFor="subjectLine" className="block text-sm font-medium text-gray-700 mb-1">
            Subject Line
          </label>
          <input
            type="text"
            id="subjectLine"
            placeholder="Enter the subject"
            value={subjectLine}
            onChange={(e) => setSubjectLine(e.target.value)}
            className="w-full border-gray-300 rounded p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="w-full border-gray-300 rounded p-2"
          >
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border-gray-300 rounded p-2"
            required
          >
            <option value="">Select a category</option>
            <option value="payment">Payment</option>
            <option value="order">Order</option>
            <option value="other">Other</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default RaiseTicket;
