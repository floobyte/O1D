'use client';

import { useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });

    const data = await res.json();
    setMessage(data.message);
  };

  return (
    <div className="p-4 flex justify-center items-center flex-col h-screen">
      <h1 className='p-4'>Reset Password</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter your new password"
          required
          className="border p-2 mb-4 text-gray-700"
        />
        <button type="submit" className="bg-blue-500 text-white p-2">Reset Password</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
