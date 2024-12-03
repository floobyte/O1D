"use client";

import React, { useState } from 'react';

const ReplyToTicket = () => {
  const [ticketId, setTicketId] = useState('');
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    setError(null);
    setResponse(null);

    try {
      const res = await fetch('/api/support/ticket/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ticketId, message }),
      });

      const data = await res.json();

      if (res.ok) {
        setResponse(data.message);
      } else {
        setError(data.error || 'Something went wrong.');
      }
    } catch (err) {
      
      console.error('Error:', err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 p-4 text-gray-100">
      <h1 className="text-2xl font-bold mb-4">Reply to Ticket</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded px-8 pt-6 pb-8 w-full max-w-md"
      >
        <div className="mb-4">
          <label
            htmlFor="ticketId"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Ticket ID
          </label>
          <input
            type="text"
            id="ticketId"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter ticket ID"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your reply"
            
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Submit
        </button>
      </form>

      {response && (
        <div className="mt-4 text-green-500 font-bold">{response}</div>
      )}
      {error && <div className="mt-4 text-red-500 font-bold">{error}</div>}
    </div>
  );
};

export default ReplyToTicket;
