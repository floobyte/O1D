// app/admin/page.tsx
'use client';

import React, { useState } from 'react';

const BlockUser = () => {
  const [userId, setUserId] = useState('');
  const [block, setBlock] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResponseMessage(''); // Clear previous messages

    try {
      const response = await fetch('/api/users/block', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, block }),
      });

      const result = await response.json();
      console.log({response});
      // if (!response.ok) {
      //   throw new Error(result.error || 'Failed to process request');
      // }

      setResponseMessage(result.message);
    } catch (error: unknown) {
      if (error instanceof Error) {
        setResponseMessage(error.message);
      } else {
        // Handle the case where error is not an instance of Error
        setResponseMessage('An unknown error occurred');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>User Management</h1>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <label>
          User ID:
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ margin: '10px', padding: '5px' }}
            required
          />
        </label>
        <label>
          Block:
          <select
            value={block.toString()}
            onChange={(e) => setBlock(e.target.value === 'true')}
            style={{ margin: '10px', padding: '5px' }}
          >
            <option value="false">Unblock</option>
            <option value="true">Block</option>
          </select>
        </label>
        <button
          type="submit"
          style={{
            margin: '10px',
            padding: '10px',
            backgroundColor: 'blue',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Submit
        </button>
      </form>
      {responseMessage && (
        <p style={{ marginTop: '20px', color: responseMessage.includes('successfully') ? 'green' : 'red' }}>
          {responseMessage}
        </p>
      )}
    </div>
  );
};

export default BlockUser;
