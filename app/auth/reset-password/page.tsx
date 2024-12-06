"use client";
import { useState, useEffect } from 'react';
import { useAuthContext } from '@/app/context/AuthContext';

const ResetPassword = () => {
    const [resetToken, setResetToken] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const { userId } = useAuthContext();

    // Step 1: Fetch the reset token
    useEffect(() => {
        const fetchToken = async () => {
            try {
                const response = await fetch(`/api/auth/reset-password?userId=${userId}`);
                const data = await response.json();
                setResetToken(data.resetToken);
            } catch (error) {
                console.error('Error fetching reset token:', error);
            }
        };

        fetchToken();
    }, []);

    // Step 2: Use the reset token to reset the password
    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: resetToken, newPassword }),
            });
            const data = await response.json();
            setMessage(data.message);
        } catch (error) {
            console.error('Error resetting password:', error);
        }
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
};

export default ResetPassword;
