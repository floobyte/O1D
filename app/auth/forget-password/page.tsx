'use client';

import { useState } from 'react';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch('/api/auth/forget-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email }),
        });

        const data = await res.json();
        setMessage(data.message);
    };

    return (
        <div className="p-4 flex justify-center items-center flex-col h-screen">
            <h1 className='p-4 text-white text-4xl'>Forgot Password</h1>
            <p className='p-4 mb-12 text-white text-center'>
                Enter the email address you use on O1B. <br />We'll send you a link on register email to reset your password.
            </p>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="border p-2 mb-4 text-gray-700"
                />
                <button type="submit" className="bg-blue-500 text-white p-2">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
