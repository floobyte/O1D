'use client';

import { useState } from 'react';
import { useAuthContext } from '@/app/context/AuthContext';

const CloseTicket = () => {
  const { userId } = useAuthContext(); // Access userId directly from context
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  // Function to handle the ticket closing
  const handleCloseTicket = async () => {
    if (!userId) {
      setError('User ID is required');
      return;
    }

    try {
      // Call the API to close the ticket with the userId
      const response = await fetch(`/api/support/ticket/closeTicket/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }), // Send userId to the server
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message); // Display success message
      } else {
        setError(data.error || 'Failed to close the ticket'); // Handle errors from the server
      }
    } catch (err) {
      setError('An error occurred while closing the ticket');
      console.error('Failed to close ticket:', err); // Log the error for debugging
    }
  };

  return (
    <div className="ticket-container">
      <h2>Close Ticket</h2>

      {/* Button to close the ticket */}
      <div>
        <button onClick={handleCloseTicket} className="btn btn-primary">
          Close Ticket
        </button>
      </div>

      {/* Display the message or error */}
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default CloseTicket;
