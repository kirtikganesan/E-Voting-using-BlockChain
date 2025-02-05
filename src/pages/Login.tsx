import React, { useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { type } = useParams();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (type === 'admin') {
      // Admin login check: only allow if email is admin@gmail.com and password is 123
      if (email === 'admin@gmail.com' && password === '123') {
        navigate('/admin/candidates');
      } else {
        setError('Invalid credentials');
      }
    } else if (type === 'voter') {
      // Voter login: check credentials against the database
      try {
        const response = await fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        const data = await response.json();
        if (!response.ok) {
          setError(data.error || 'Invalid credentials');
        } else {
          navigate('/voter/guidelines');
        }
      } catch (err) {
        setError('Something went wrong. Please try again.');
        console.error(err);
      }
    } else {
      setError('Invalid user type');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-8">
          {type === 'voter' ? 'Voter Login' : 'Admin Login'}
        </h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
        
        {type === 'voter' && (
          <div className="mt-4 text-center">
            <span>Not a user? </span>
            <Link to="/register" className="text-indigo-600 hover:underline">
              Register Now
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
